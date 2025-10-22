import unittest
import uuid
from bson import ObjectId
from gridfs import GridFSBucket, NoFile
from pymongo import MongoClient
from starlette.testclient import TestClient
from app import app
from core.constants import JwtTokenScope, DATABASE_URL, COLLECTIONS, DATABASE_NAME, BUCKETS
from core.security import security_manager
from tests.config import TEST_USER


class DriveTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls._client = TestClient(app).__enter__()
        cls.auth_token = security_manager.create_access_token(TEST_USER, JwtTokenScope.auth)
        cls.user_record = cls._client.get(
        "/user",
          headers={"Authorization": "Bearer {}".format(cls.auth_token)}
        ).json()
        cls.mongo_client = MongoClient(DATABASE_URL)
        cls.database = cls.mongo_client[DATABASE_NAME]
        cls.files_collection = cls.database[COLLECTIONS.FILES]
        cls.trash_collection = cls.database[COLLECTIONS.TRASH]
        cls.file_bucket = GridFSBucket(cls.database, BUCKETS.FILE_STORAGE.name)

    @classmethod
    def tearDownClass(cls):
        for file_record in cls.files_collection.find({"owner": TEST_USER}):
            if str(file_record["_id"]) != cls.user_record["drive_root_id"]:
                cls.files_collection.delete_one({"_id": file_record["_id"]})
        for file_record in cls.trash_collection.find({"owner": TEST_USER}):
            cls.trash_collection.delete_one({"_id": file_record["_id"]})

            if file_uri := file_record.get("uri"):
                try:
                    cls.file_bucket.delete(ObjectId(file_uri))
                except NoFile:
                    pass

        cls.mongo_client.close()
        cls._client.__exit__(None, None, None)

    def _upload_test_file(self, parent_id, file_name):
        auth_token = self.auth_token
        fake_payload = b"Hello world"

        endpoint = f"/drive/upload-file/{parent_id}?file_name={file_name}"
        headers = {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "multipart/form-data",
        }
        upload_response = self._client.post(
            endpoint,
            headers=headers,
            content=fake_payload
        )
        self.assertEqual(upload_response.status_code, 200)
        response_body =  upload_response.json()
        return response_body["result"], response_body["file_uri"]

    def _create_folder(self, parent_id, folder_name):
        auth_token = self.auth_token
        response = self._client.post(
            "drive/create-folder",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "parent_id": parent_id,
                "name": folder_name,
            }
        )
        return response.json()["new_folder"]

    def test_upload_file(self):
        auth_token = self.auth_token
        user_record = self.user_record
        drive_root_id = user_record['drive_root_id']

        random_file_name = uuid.uuid4().hex + ".txt"
        self._upload_test_file(drive_root_id, random_file_name)
        does_exist = any(
            file["name"] == random_file_name
            for file in self.files_collection.find({"parent_id": drive_root_id})
        )
        self.assertTrue(does_exist)

        # Clean up
        list_content_response = self._client.get(
            f"/drive/list-content/{drive_root_id}",
            headers={"Authorization": f"Bearer {auth_token}"},
        )
        files = list_content_response.json()["result"]
        for file in files:
            self.files_collection.delete_one({"_id": ObjectId(file["_id"])})
            try:
                self.file_bucket.delete(ObjectId(file["uri"]))
            except NoFile:
                ...

    def test_upload_file_invalid_parent(self):
        auth_token = self.auth_token
        fake_id = "a" * 24
        endpoint = f"/drive/upload-file/{fake_id}?file_name=hello.txt"
        headers = {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "multipart/form-data",
        }
        upload_response = self._client.post(
            endpoint,
            headers=headers,
            content=b"Hello World!"
        )
        self.assertEqual(upload_response.status_code, 404)
    
    def test_move_file_to_trash(self):
        auth_token = self.auth_token
        user_record = self.user_record
        drive_root_id = user_record['drive_root_id']

        parent_folder_name = uuid.uuid4().hex
        child_folder_name = uuid.uuid4().hex

        insertion_result = self._client.post(
            '/drive/create-folder',
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"parent_id": drive_root_id, "name": parent_folder_name}
        )
        self.assertEqual(insertion_result.status_code, 200)
        parent_folder_id = insertion_result.json()["new_folder"]

        insertion_result = self._client.post(
            '/drive/create-folder',
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"parent_id": parent_folder_id, "name": child_folder_name}
        )
        self.assertEqual(insertion_result.status_code, 200)
        child_folder_id = insertion_result.json()["new_folder"]

        move_to_trash_result = self._client.post(
            "/drive/move-to-trash",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"files": [parent_folder_id]},
        )
        self.assertEqual(move_to_trash_result.status_code, 200)

        # Check for existence
        search_parent_result = self.files_collection.find_one({"_id": ObjectId(parent_folder_id)})
        self.assertIsNone(search_parent_result)

        search_child_result = self.files_collection.find_one({"_id": ObjectId(child_folder_id)})
        self.assertIsNone(search_child_result)

        search_parent_in_trash = self.trash_collection.find_one({"_id": ObjectId(parent_folder_id)})
        self.assertIsNotNone(search_parent_in_trash)

        search_child_in_trash = self.trash_collection.find_one({"_id": ObjectId(child_folder_id)})
        self.assertIsNotNone(search_child_in_trash)

    def test_delete_files_from_trash(self):
        auth_token = self.auth_token

        parent_name = "outer_parent-" + uuid.uuid4().hex
        child_name = "inner_parent-" + uuid.uuid4().hex
        child_file_name1 = "inner_file1-" + uuid.uuid4().hex + ".txt"
        child_file_name2 = "inner_file2-" + uuid.uuid4().hex + ".txt"

        outer_parent_id = self._create_folder(self.user_record["drive_root_id"], parent_name)
        inner_parent_id = self._create_folder(outer_parent_id, child_name)
        child_file_id1, child_file_uri1 = self._upload_test_file(inner_parent_id, child_file_name1)
        child_file_id2, child_file_uri2 = self._upload_test_file(inner_parent_id, child_file_name2)

        assert self._client.post(
        "/drive/move-to-trash",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"files": [outer_parent_id]}
        ).status_code == 200

        for file_id in [outer_parent_id, inner_parent_id, child_file_id1, child_file_id2]:
            find_file_in_files_response = self.files_collection.find_one({"_id": ObjectId(file_id)})
            self.assertIsNone(find_file_in_files_response)

            find_file_in_trash_response = self.trash_collection.find_one({"_id": ObjectId(file_id)})
            self.assertIsNotNone(find_file_in_trash_response)

        assert self._client.post(
            "/drive/delete-from-trash",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"files": [outer_parent_id]},
        ).status_code == 200

        for file_uri in [child_file_uri1, child_file_uri2]:
            find_file_object_response = self.file_bucket._files.find_one({"_id": ObjectId(file_uri)})
            self.assertIsNone(find_file_object_response)

if __name__ == '__main__':
    unittest.main()
