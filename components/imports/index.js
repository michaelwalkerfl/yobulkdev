import React, { useState, useEffect, useCallback } from 'react';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import FileDownload from 'js-file-download';

const ImportsComponent = () => {
  const [importData, setImportData] = useState({});
  const [loading, setLoading] = useState(true);
  const [downloadCollection, setDownloadCollection] = useState({});
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/imports`)
      .then((res) => {
        setImportData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const onBtnExport = () => {
    if (!downloadCollection.fileName) {
      setShowWarning(true);
      return;
    }
    var options = {
      method: 'GET',
      url: '/api/downloads',
      responseType: 'blob',
      headers: {
        collection_name: downloadCollection.collection_name,
      },
    };
    axios(options).then((response) => {
      FileDownload(response.data, downloadCollection.fileName);
    });
  };

  const handleCheckBoxSelect = (col) => {
    setDownloadCollection(col);
    setShowWarning(false);
  };
  return (
    <div className="overflow-x-auto mx-4 relative mt-10">
      <div className="flex align-middle justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-500">
          List of CSVs Imported
        </h1>
        <button
          onClick={onBtnExport}
          type="button"
          className="flex bg-white border-2 border-black text-black hover:text-white hover:bg-black focus:outline-none font-medium rounded-lg text-sm px-6 py-2 text-center mb-2 float-right"
        >
          Download Imported CSV
          <DocumentArrowDownIcon className="h-5 w-5 ml-2" aria-hidden="true" />
        </button>
      </div>
      {showWarning && (
        <span className="text-red-700">Please select a file to download</span>
      )}
      <table className="w-full bg-white rounded-2xl text-sm text-gray-500 dark:text-gray-400 table shadow-md mt-20 border-2">
        <thead className="text-xs text-white uppercase h-10 bg-blue-500">
          <tr>
            <th>Select</th>
            <th scope="col" className="py-3">
              Organization Id
            </th>
            <th scope="col" className="py-3">
              Import ID
            </th>
            <th scope="col" className="py-3 ">
              File Name
            </th>
            <th scope="col" className="py-3">
              <span>Rows</span>
            </th>
            <th scope="col" className="py-3">
              <span>Started Date</span>
            </th>
            <th scope="col" className="py-3">
              <span>Submitted Date</span>
            </th>
            <th scope="col" className="py-3">
              <span>Status</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(importData) && importData.length > 0 ? (
            importData.map((col, idx) => (
              <tr key={idx} className="h-10 text-center">
                <td>
                  <input
                    checked={col._id === downloadCollection._id}
                    onClick={() => handleCheckBoxSelect(col)}
                    type="checkbox"
                  />
                </td>
                <td>{col.orgId || 'NA'}</td>
                <td>{col.importerId || 'NA'}</td>
                <td>{col.fileName || 'NA'}</td>
                <td>{col.rows}</td>
                <td>
                  {col.created_date ? col.created_date.split('T')[0] : 'NA'}
                </td>
                <td>
                  {col.created_date ? col.created_date.split('T')[0] : 'NA'}
                </td>
                <td>
                  {col.status === 'Complete' ? (
                    <span className="text-green-700">Complete</span>
                  ) : (
                    <span className="text-red-700">Incomplete</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr key={1} className="h-10 text-center">
              <td>{loading ? 'Loading...' : 'No Data'}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ImportsComponent;
