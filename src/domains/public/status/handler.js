const checkStatus = () => {
  try {
    res.status(200).send("Worklink API is up and running");
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export default checkStatus;