from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase
from core.constants import DATABASE_URL, DATABASE_NAME, COLLECTIONS


class MongoDBClient:
    _client: AsyncMongoClient | None = None
    _database: AsyncDatabase | None = None

    def connect(self):
        self._client = AsyncMongoClient(DATABASE_URL)
        self._client = AsyncMongoClient(DATABASE_URL)
        self._database = self._client.get_database(DATABASE_NAME)

    def disconnect(self):
        self._client.close()

    @property
    def users(self):
        return self._database[COLLECTIONS.USERS]


mongo = MongoDBClient()