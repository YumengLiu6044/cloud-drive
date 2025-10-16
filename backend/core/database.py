import gridfs
from gridfs import AsyncGridFSBucket
from pymongo import AsyncMongoClient
from core.constants import DATABASE_URL, DATABASE_NAME, COLLECTIONS, BUCKETS


class MongoDBClient:
    _client: AsyncMongoClient | None = None
    _bucket_instance: AsyncGridFSBucket | None = None

    async def connect(self):
        self._client = AsyncMongoClient(DATABASE_URL)
        await self._client.admin.command('ping')

    async def disconnect(self):
        await self._client.close()

    @property
    def database(self):
        if self._client is None:
            raise RuntimeError("MongoDB client is not connected")

        return self._client[DATABASE_NAME]

    @property
    def users(self):
        return self.database[COLLECTIONS.USERS]

    @property
    def files(self):
        return self.database[COLLECTIONS.FILES]

    @property
    def profile_bucket(self):
        if self._bucket_instance is not None:
            return self._bucket_instance

        self._bucket_instance = gridfs.AsyncGridFSBucket(self.database, BUCKETS.PROFILE_PICTURES.name)
        return self._bucket_instance


mongo = MongoDBClient()