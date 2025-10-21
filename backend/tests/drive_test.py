import unittest

from bson import ObjectId
from starlette.testclient import TestClient
from app import app
from core.constants import JwtTokenScope
from core.database import mongo
from core.security import security_manager
from tests.config import TEST_USER


class DriveTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls._client = TestClient(app).__enter__()

    @classmethod
    def tearDownClass(cls) -> None:
        cls._client.__exit__(None, None, None)

    async def test_upload_file(self):
        auth_token = security_manager.create_access_token(TEST_USER, JwtTokenScope.auth)
        user_record_response = self._client.get("/user", headers={"Authorization": f"Bearer {auth_token}"})
        self.assertEqual(user_record_response.status_code, 200)
        user_record = user_record_response.json()
        drive_root_id = user_record['drive_root_id']

        endpoint = f"/drive/upload-file/{drive_root_id}?file_name=hello.txt"
        headers = {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "multipart/form-data",
        }
        upload_response = self._client.post(
            endpoint,
            headers=headers,
            content=b"Hello World!"
        )
        self.assertEqual(upload_response.status_code, 200)

        # Clean up
        list_content_response = self._client.get(
            f"/drive/list-content/{drive_root_id}",
            headers={"Authorization": f"Bearer {auth_token}"},
        )
        files = list_content_response.json()
        for file in files:
            await mongo.files.delete_one({"_id": ObjectId(file["_id"])})
            await mongo.file_bucket.delete({"_id": ObjectId(file["uri"])})

    def test_upload_file_invalid_parent(self):
        auth_token = security_manager.create_access_token(TEST_USER, JwtTokenScope.auth)
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

if __name__ == '__main__':
    unittest.main()
