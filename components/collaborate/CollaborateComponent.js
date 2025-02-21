import { useState, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import SuccessModal from '../common/SuccessModal';
import WarningModal from '../common/WarningModal';

const CollaborateComponent = () => {
  const [orgName, setOrgName] = useState(undefined);
  const [workspaceName, setWorkspaceName] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [name, setName] = useState('');
  const [isVisible, setVisible] = useState(false);
  const [warning, setWarning] = useState(false);
  // const [collaborateData, setCollaborateData] = useState();

  function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const handleAdd = (e) => {
    e.preventDefault();
    if (!validateEmail(name)) {
      alert('Please enter a valid email');
    } else setCollaborators([...collaborators, name]);
    setName('');
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (!orgName || !workspaceName || !collaborators) {
      setWarning(true);
      return;
    }
    axios
      .post('/api/collaborate', {
        orgName,
        workspaceName,
        collaborators,
      })
      .then((response) => {
        setVisible(true);
      })
      .catch((error) => console.log(error));
  };

  const acknowledgeModal = () => {
    setVisible(false);
    setOrgName('');
    setWorkspaceName('');
    setCollaborators([]);
  };

  const handleDelete = (value) => {
    const newCollaborators = collaborators.filter((item) => item !== value);
    setCollaborators(newCollaborators);
  };

  return (
    <div className="">
      {isVisible && (
        <SuccessModal
          submit={acknowledgeModal}
          message={'Successfully added the workspace !'}
        />
      )}
      {warning && (
        <WarningModal
          setWarning={setWarning}
          message={'Please fill all required fields !'}
        />
      )}
      <div className="flex mt-4 w-full bg-white shadow-sm rounded-md py-1 px-2 align-middle justify-between">
        <form className="p-5 w-full">
          <div className="flex mt-7 align-middle items-center">
            <div className="flex flex-col w-5/12">
              <h2 className="text-lg font-bold text-gray-500">
                Create an Organization{' '}
              </h2>
              <p className="text-gray-400">
                The Organization Name to identify your organization
              </p>
            </div>
            <div className="flex flex-col justify-center w-1/2">
              <input
                type="text"
                className={`border border-gray-300 text-gray-400  text-sm rounded-lg
                   focus:ring-blue-500 focus:border-blue-500 block
                   p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                placeholder="Enter Organization Name Here ..."
                value={orgName}
                onChange={(evt) => setOrgName(evt.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex mt-7 align-middle items-center">
            <div className="flex flex-col w-5/12">
              <h2 className="text-lg font-bold text-gray-500">
                Create a Workspace
              </h2>
              <p className="text-gray-400">
                The Workspace Name to identify your workspace
              </p>
            </div>
            <div className="flex flex-col justify-center w-1/2">
              <input
                type="text"
                className={`border border-gray-300 text-gray-400  text-sm rounded-lg
                focus:ring-blue-500 focus:border-blue-500 block
                p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                placeholder="Enter Workspace Name Here ..."
                value={workspaceName}
                onChange={(evt) => setWorkspaceName(evt.target.value)}
                required
              />
            </div>
          </div>

          <hr className="my-7 align-middle items-center border-black" />

          <div className="flex">
            <div className="flex flex-col w-5/12">
              <h2 className="text-lg font-bold text-gray-500">
                Add Collaborators
              </h2>
              <p className="text-gray-400">
                The Collaborators to add to your workspace
              </p>
            </div>
            <div className="flex flex-col justify-center w-1/2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={name}
                  className={`border border-gray-300 text-gray-400  text-sm rounded-lg
                   focus:ring-blue-500 focus:border-blue-500 block w-full
                   p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  placeholder="Enter Collaborator Email Here ..."
                  onChange={(evt) => setName(evt.target.value)}
                />
                <button
                  type="submit"
                  className="bg-white border-2 border-black text-black hover:text-white hover:bg-black focus:outline-none font-medium rounded-lg text-sm px-6 py-2 text-center"
                  onClick={handleAdd}
                >
                  ADD
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-10 bg-white border-2 border-black text-black hover:text-white hover:bg-black focus:outline-none font-medium rounded-lg text-sm px-6 py-2 text-center mb-2 float-right"
            onClick={handleClick}
          >
            SUBMIT
          </button>
        </form>
      </div>

      <div className="flex w-1/3 flex-col mt-4 bg-white shadow-sm rounded-md py-1 px-2 ">
        <h1 className="text-lg text-center font-bold text-gray-500">
          Collaborators
        </h1>

        <ul className="flex flex-col gap-2 mt-4 my-2 p-2">
          {collaborators.length === 0 && (
            <li className="text-slate-500">No Collaborators Added</li>
          )}
          {collaborators.map((collaborator, index) => (
            <li key={index} className="text-slate-500 flex justify-between">
              {collaborator}

              <button
                className="bg-red-200 py-1 px-2 rounded shadow-sm"
                onClick={() => handleDelete(collaborator)}
              >
                <TrashIcon className="w-4 h-4 text-red-600" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CollaborateComponent;
