
const logErrorMessageController = (selFn, error) => {
    console.log(`***** ERROR in [ Controllers --> ${selFn} ] ***** \n`, error)
  }

const logErrorMessageModel = (selFn, error) => {
    console.log(`***** ERROR in [ Models --> ${selFn} ] ***** \n`, error)
}
  
const validateEmail = (data) => {
    if ( Array.isArray(data) ) {
        let valid = true
        data.forEach(x => {
        if (!x.includes('@') || typeof x !== 'string' ) {
            valid = false
        }
        })
        return valid
    } else {
        return ( typeof data !== 'string' || !data.includes('@') ) ?  false : true
    }
}

module.exports = {
    logErrorMessageController,
    logErrorMessageModel,
    validateEmail,
}