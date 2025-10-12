from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import mongo
from routers.auth import auth_router
from contextlib import asynccontextmanager
from routers.user import user_router


@asynccontextmanager
async def lifespan(_: FastAPI):
    await mongo.connect()
    yield
    await mongo.disconnect()

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
@app.get('/')
async def root():
    return {"message": "Welcome to Cloud Drive"}
