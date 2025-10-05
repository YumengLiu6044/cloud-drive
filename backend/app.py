from fastapi import FastAPI
from core.database import mongo
from routers.auth import auth_router
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(_: FastAPI):
    mongo.connect()
    yield
    mongo.close()

app = FastAPI(lifespan=lifespan)
app.include_router(auth_router)

@app.get('/')
def root():
    return {"message": "Welcome to Cloud Drive"}
