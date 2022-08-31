# module
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session, declarative_base
import dotenv

# load .env file
dotenv_file = dotenv.find_dotenv() 
dotenv.load_dotenv(dotenv_file)

# database connection properties
MYSQL_DIALECT  = dotenv.get_key(dotenv_file, "MYSQL_DIALECT")
MYSQL_DRIVER   = dotenv.get_key(dotenv_file, "MYSQL_DRIVER")
MYSQL_USERNAME = dotenv.get_key(dotenv_file, "MYSQL_USERNAME")
MYSQL_PASSWORD = dotenv.get_key(dotenv_file, "MYSQL_PASSWORD")
MYSQL_SERVER   = dotenv.get_key(dotenv_file, "MYSQL_SERVER")
MYSQL_PORT     = dotenv.get_key(dotenv_file, "MYSQL_PORT")
MYSQL_DB       = dotenv.get_key(dotenv_file, "MYSQL_DB")
DATABASE_URL   = f"{MYSQL_DIALECT}+{MYSQL_DRIVER}://{MYSQL_USERNAME}:{MYSQL_PASSWORD}@{MYSQL_SERVER}:{MYSQL_PORT}/{MYSQL_DB}"

#'mysql+pymysql://root@localhost:3306/general_ledger'

# reference to database w/ character set configuration
engine = create_engine(DATABASE_URL, connect_args={"charset":"utf8mb4"})

# bind session to database engine
session_factory = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# session registry
session = scoped_session(session_factory)

# metadata to collect all models
Base = declarative_base()



SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()