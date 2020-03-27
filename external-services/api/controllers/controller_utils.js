module.exports = {

    checkPreferredHeader(headers) {

        headers = headers.split(',');
        var usableheader = undefined;

        headers.some(header => {
            if(header == "application/json") {
                usableheader = header;
                return true;
            }
            
            if(header == "application/xml") 
                usableheader = header;

        });

        return usableheader;
    },

    errorHandler(err_code, sql_message = '') {

        var errorWrapper = {
            status: err_code,
            message: '',
            sql_message: sql_message
        }

        switch(err_code) {
            case 400:
                errorWrapper.message = "Bad request! Please fix it and retry!";
                break;
            case 404:
                errorWrapper.message = "Looks like you are trying to access a resource that does not exists!";
                break;
            case 405:
                errorWrapper.message = "Looks like you are trying to call a method on a collection you are not allowed to, "
                                        + "more info at https://documenter.getpostman.com/view/9730804/SWEE1aDe?version=latest";
                break;
            case 406:
                errorWrapper.message = "You are missing the Accept headers on you request, or you are requesting a data type we can't manage "
                                        + "we can return either JSON or XML responses, more info at https://documenter.getpostman.com/view/9730804/SWEE1aDe?version=latest";
                break;
            case 409:
                errorWrapper.message = "You are trying to add a record with duplciate values from another one, or editing a record and the new values are duplicates";
                break;
            case 500:
                errorWrapper.message = "Ooops! That's on our side! Please contact us about the error and provide as much info as possible!";
                break;
            default:
                errorWrapper.message = "Mhhh... unexpected error i guess";
                break;

        }
        
        return this.formatResponse(undefined, errorWrapper, undefined);

    },

    formatResponse(res = undefined, err = undefined, meta = undefined) {
        var responseWrapper = {
            data: '', 
            errors: '', 
            meta: ''
        };

        if(res) responseWrapper.data = res;
        if(err) responseWrapper.errors = err;
        if(meta) responseWrapper.meta = meta;
        return responseWrapper;
    }
}