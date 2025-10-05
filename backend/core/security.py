from passlib.hash import sha256_crypt


class SecurityManager:
    @staticmethod
    def hash_password(password):
        return sha256_crypt.hash(password)

    @staticmethod
    def verify_password(password, hashed_password):
        """
        :param password: The password to verify
        :param hashed_password: The password on file
        :return: If the password is valid
        """
        return sha256_crypt.verify(password, hashed_password)


security_manager = SecurityManager()
