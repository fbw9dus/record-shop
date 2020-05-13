
exports.getPaginatedList = function(Model,opts={}){
  return async (req, res, next) => {

    let {
      recordsPerPage=4,
      pageNumber=0,
      search='',
      searchField='',
      sortField='id',
      sortOrder=1
    } = req.query;

    recordsPerPage = parseInt(recordsPerPage);
    pageNumber     = parseInt(pageNumber);

    const skipRecords = Math.max(0,recordsPerPage * pageNumber);

    // anzahl der dokumente abrufen
    const numberOfRecords = await Model.estimatedDocumentCount();

    // liste der dokumente abrufen
    if ( recordsPerPage === -1 ) recordsPerPage = undefined;

    const findOpts = opts.find || {}

    if ( search ) findOpts[searchField] = {
      $regex: search,
      $options: 'i'
    }

    let readDB = Model.find(
      findOpts, null, {
        limit: recordsPerPage,
        skip:  skipRecords,
        sort:  { [sortField]: sortOrder }
      }
    )

    if ( opts.populate )
      opts.populate
      .forEach( field => readDB = readDB.populate(field) );

    const list = await readDB;

    // liste und metadaten senden
    res.status(200).send({
      list, count: numberOfRecords
    });
  };
};
