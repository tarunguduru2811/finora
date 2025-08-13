

export function handleError(res:any,error:any,status=500){
    console.error(error);
    return res.status(status).json({
        error:error?.message || "Internal Server Error"
    })
}