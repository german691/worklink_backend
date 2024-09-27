export const checkStatus = (req, res) => {
  try {
    res.status(200).json({
      status: 200,
      message: "Worklink API up and running.",
  });
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const endpointNotFound = (req, res) => {
  res.status(404).json({
    status: 404,
    message: "Endpoint not found, perhaps you're using the wrong method?",
    url: req.protocol + '://' + req.get('host') + req.originalUrl,
    body: req.body, 
    params: req.params,
    method: req.method
  });
}