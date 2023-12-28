const returnClarifaiRequestOptions = (imageUrl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = "";
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = "kjardine00";
  const APP_ID = "face-recognition-app";
  // Change these to whatever model and image URL you want to use

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: imageUrl,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  return requestOptions;
};

const handleAPIcall = (req, res) => {
  const MODEL_ID = "face-detection";
  const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";
  const IMAGE_URL = req.body.input;

  fetch(
    "https://api.clarifai.com/v2/models/" +
      MODEL_ID +
      "/versions/" +
      MODEL_VERSION_ID +
      "/outputs",
    returnClarifaiRequestOptions(IMAGE_URL)
  )
    .then((response) => response.json())
    .then((response) => {
      if (response) {
        res.json(response);
      }
    })
    .catch(() => res.status(400).json("failed to connect to api"));
};

const handleImage = (req, res, db) => {
  const { id, entries } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", entries)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch(() => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleAPIcall: handleAPIcall,
  handleImage: handleImage,
};
