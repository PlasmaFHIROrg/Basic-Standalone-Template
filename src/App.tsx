import React, { useState, useEffect } from 'react';
import './App.css';
import { fhirclient } from 'fhirclient/lib/types';
import Client from 'fhirclient/lib/Client';

import { Patient, HumanName, FamilyMemberHistory, AllergyIntolerance } from 'fhir-resource-typescript-generator/models';
import { HumanNameView, AllergyIntoleranceView, FamilyMemberHistoryView } from 'plasmafhir-react-components/build';
import { TestComponent } from 'plasmafhir-react-components/build';

export interface IHumanNameViewProps { humanName?: HumanName };

interface IAppProps {
  client: Client;
}

function App(props: IAppProps) {

  const { client } = props;

  // State...
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isPatientLoaded, setIsPatientLoaded] = useState<boolean>(false);
  const [allergyIntolerance, setAllergyIntolerance] = useState<AllergyIntolerance[]>([]);
  const [isAllergyIntoleranceLoaded, setIsAllergyIntoleranceLoaded] = useState<boolean>(false);
  const [familyMemberHistory, setFamilyMemberHistory] = useState<FamilyMemberHistory[]>([]);
  const [isFamilyMemberHistoryLoaded, setIsFamilyMemberHistoryLoaded] = useState<boolean>(false);

  // Fetch data...
  useEffect(() => {

    // Patient...
    if (!isPatientLoaded)
    {
      client.patient.read().then((patient: fhirclient.FHIR.Patient) => {
        console.log("Patient");
        setIsPatientLoaded(true);
        setPatient(patient);
      });
    }

    // AllergyIntolerance...
    if (!isAllergyIntoleranceLoaded)
    {
      client.request(`/AllergyIntolerance?patient=${client.patient.id}`, options).then((value: any) => {
        console.log("allergy", value);
        setIsAllergyIntoleranceLoaded(true);
        setAllergyIntolerance(value);
      });
    }

    // FamilyMemberHistory...
    if (!isFamilyMemberHistoryLoaded)
    {
      client.request(`/FamilyMemberHistory?patient=${client.patient.id}`, options).then((value: FamilyMemberHistory[]) => {
        console.log("fam", value);
        setIsFamilyMemberHistoryLoaded(true);
        setFamilyMemberHistory(value);
      });
    }

  }, []);



  const options = { flat: true };

  // Read patient data and save it when read...
  
  
  

  

  /*
  client.request(`/MedicationRequest?patient=${client.patient.id}`, { resolveReferences: "medicationReference", pageLimit: 0, flat: true }).then((value: any) => {
    console.log("med", value);
  });
  */
  

  let elName = null;
  if (patient && patient.name)
  {
    let name = patient.name;
    if (Array.isArray(patient.name) && patient.name.length > 0) { name = (name as HumanName[])[0]; }
    elName = <HumanNameView humanName={name as HumanName} />
  }

  let elAllergyIntolerance: JSX.Element[] = [];
  if (allergyIntolerance)
  {
    elAllergyIntolerance = allergyIntolerance
      .filter((x: AllergyIntolerance) => { return (x as any).resourceType === "AllergyIntolerance"; })
      .map((x: any, idx: number) => { return <div>{x.substance.text}</div> });
      //.map((x: AllergyIntolerance, idx: number) => { return <AllergyIntoleranceView allergyIntolerance={x} key={"AllergyIntolerance_" + idx.toString()} />; });
  }

  let elFamilyHistory: JSX.Element[] = [];
  if (familyMemberHistory)
  {
    elFamilyHistory = familyMemberHistory
      .filter((x: FamilyMemberHistory) => { return (x as any).resourceType === "FamilyMemberHistory"; })
      .map((x: FamilyMemberHistory, idx: number) => { return <FamilyMemberHistoryView familyMemberHistory={x} key={"FamilyMemberHistory_" + idx.toString()} />; });
  }

  return (
    <div className="App">
      {elName}

      <h2>Allergy Intolerance</h2>
      {elAllergyIntolerance}

      <h2>Family Member History</h2>
      {elFamilyHistory}
    </div>
  );
}

export default App;