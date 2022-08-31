#Module
from fastapi import HTTPException

#Save file 
def save_file (path, content):
    if content != None:
        try:
            with open(path, "wb") as file:
                file.write(content)
        except:
            raise HTTPException(status_code=500, detail='Internal Server Error.')
