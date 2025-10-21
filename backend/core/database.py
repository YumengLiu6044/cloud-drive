import gridfs
from gridfs import AsyncGridFSBucket
from pymongo import AsyncMongoClient
from core.constants import DATABASE_URL, DATABASE_NAME, COLLECTIONS, BUCKETS


class MongoDBClient:
    _client: AsyncMongoClient | None = None
    _profile_bucket_instance: AsyncGridFSBucket | None = None
    _file_storage_instance: AsyncGridFSBucket | None = None

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
    def trash(self):
        return self.database[COLLECTIONS.TRASH]

    @property
    def profile_bucket(self):
        if self._profile_bucket_instance is not None:
            return self._profile_bucket_instance

        self._profile_bucket_instance = gridfs.AsyncGridFSBucket(self.database, BUCKETS.PROFILE_PICTURES.name)
        return self._profile_bucket_instance

    @property
    def file_bucket(self):
        if self._file_storage_instance is not None:
            return self._file_storage_instance

        self._file_storage_instance = gridfs.AsyncGridFSBucket(self.database, BUCKETS.FILE_STORAGE.name)
        return self._file_storage_instance

mongo = MongoDBClient()