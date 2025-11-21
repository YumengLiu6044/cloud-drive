from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from core.constants import SESSION_SECRET
from core.database import mongo
from routers.auth import auth_router
from contextlib import asynccontextmanager
from routers.drive import drive_router
from routers.google_auth import google_auth_router
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
app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET
)

app.include_router(auth_router, prefix="/api")
app.include_router(user_router, prefix="/api")
app.include_router(drive_router, prefix="/api")
app.include_router(google_auth_router, prefix="/api")
@app.get('/')
async def root():
    return {"message": "Welcome to Cloud Drive"}
