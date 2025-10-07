import unittest
from starlette.testclient import TestClient
from app import app
from core.constants import JwtTokenScope
from core.security import security_manager
from tests.config import TEST_USER, DNE_USER


class AuthTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls._client = TestClient(app).__enter__()

    @classmethod
    def tearDownClass(cls) -> None:
        cls._client.__exit__(None, None, None)

    def test_reset_token_invalid(self):
        reset_token = security_manager.create_access_token(TEST_USER, JwtTokenScope.password_reset)
        reset_token += "nana"
        result = self._client.post(
        "/auth/reset-password",
            json={"new_password": "random_password"},
           headers={"Authorization": f"Bearer {reset_token}"})
        self.assertEqual(result.status_code, 401)

    def test_reset_token_user_dne(self):
        reset_token = security_manager.create_access_token(DNE_USER, JwtTokenScope.password_reset)
        result = self._client.post(
        "/auth/reset-password",
            json={"new_password": "random_password"},
           headers={"Authorization": f"Bearer {reset_token}"})
        self.assertEqual(result.status_code, 404)

    def test_reset_token_valid(self):
        reset_token = security_manager.create_access_token(TEST_USER, JwtTokenScope.password_reset)
        new_password = "random_password"

        result = self._client.post(
        "/auth/reset-password",
            json={"new_password": new_password},
           headers={"Authorization": f"Bearer {reset_token}"})
        self.assertEqual(result.status_code, 200)

        result = self._client.post(
            "/auth/login",
            json={
                "email": TEST_USER,
                "password": new_password,
            }
        )
        self.assertEqual(result.status_code, 200)

if __name__ == '__main__':
    unittest.main()
