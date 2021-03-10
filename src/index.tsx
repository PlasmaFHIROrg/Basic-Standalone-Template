import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import FHIR from "fhirclient";
import { fhirclient } from 'fhirclient/lib/types';
import Client from 'fhirclient/lib/Client';

const CLIENT_ID = "6c12dff4-24e7-4475-a742-b08972c4ea27";         // This is the one from the website
const SERVER_URL = "https://open-ic.epic.com/Argonaut/api/FHIR/Argonaut";
const authParams: fhirclient.AuthorizeParams = {
  client_id: CLIENT_ID,
  iss: SERVER_URL,
  redirectUri: "test.html",
  completeInTarget: true,

  scope: "patient/*.read launch/patient",  
};

// When FHIR is authorized, pass the client to App...
const onFHIRAuthorized = (client: Client) => {
  ReactDOM.render(
    <React.StrictMode>
      <App client={client} />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

FHIR.oauth2.init(authParams).then(onFHIRAuthorized);