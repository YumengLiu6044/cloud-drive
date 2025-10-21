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


class DriveTest(unittest.IsolatedAsyncioTestCase):
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
        cls.file_bucket = GridFSBucket(cls.database, BUCKETS.FILE_STORAGE.name)

    @classmethod
    def tearDownClass(cls):
        cls.mongo_client.close()
        cls._client.__exit__(None, None, None)

    async def test_upload_file(self):
        auth_token = self.auth_token
        user_record = self.user_record
        drive_root_id = user_record['drive_root_id']

        random_file_name = uuid.uuid4().hex + ".txt"
        fake_payload = b"hello world"

        endpoint = f"/drive/upload-file/{drive_root_id}?file_name={random_file_name}"
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

        # Clean up
        list_content_response = self._client.get(
            f"/drive/list-content/{drive_root_id}",
            headers={"Authorization": f"Bearer {auth_token}"},
        )
        files = list_content_response.json()["result"]
        for file in files:
            self.files_collection.delete_one({"_id": ObjectId(file["_id"])})
            try:
                self.file_bucket.delete({"_id": ObjectId(file["uri"])})
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

    async def test_move_file_to_trash_different_parent(self):
        auth_token = self.auth_token
        user_record = self.user_record
        drive_root_id = user_record['drive_root_id']

        parent_folder_name = "parent"
        child_folder_name = "child"

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
            json={"files": [parent_folder_id, child_folder_id]},
        )
        self.assertEqual(move_to_trash_result.status_code, 400)

        # Cleanup
        self.files_collection.delete_one({"_id": ObjectId(parent_folder_id)})
        self.files_collection.delete_one({"_id": ObjectId(child_folder_id)})


if __name__ == '__main__':
    unittest.main()
