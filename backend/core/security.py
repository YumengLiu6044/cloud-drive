from passlib.context import CryptContext


class SecurityManager:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def hash_password(self, password):
        return self.pwd_context.hash(password)

    def verify_password(self, password, hashed_password):
        """
        :param password: The password to verify
        :param hashed_password: The password on file
        :return: If the password is valid
        """
        return self.pwd_context.verify(password, hashed_password)


security_manager = SecurityManager()
