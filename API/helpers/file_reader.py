#Module
from fastapi import UploadFile, HTTPException
from secrets import token_hex

async def read_file(file: UploadFile, filename: str, destination: str):
    FILE_PATH = "assets/img/"+destination

    extension = filename.split('.')[1]
    if extension.lower() not in ['jpg','jpeg','pdf']:
        raise HTTPException(status_code=415, detail='Unsupported Media Type.')

    #Generate name
    token_name = token_hex(10) + '.' + extension
    generated_name = FILE_PATH + token_name

    #Read file
    try:
        file_content = await file.read()
        return (generated_name, file_content)
    except:
        raise HTTPException(status_code=500, detail='Internal Server Error.')