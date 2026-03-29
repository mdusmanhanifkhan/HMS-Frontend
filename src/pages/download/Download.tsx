import React, { useState } from 'react';
import Button from '../../components/button/Button';
import SuccessMessage from '../../components/error-handling/SuccessMessage';
import ErrorMessage from '../../components/error-handling/ErrorMessage';

interface DownloadItem {
  title: string;
  endpoint: string;
  fileName: string;
}

const AllDownloads: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('token') || '';

  const downloadList: DownloadItem[] = [
    {
      title: 'Patients',
      endpoint: '/api/patients/export',
      fileName: 'patients',
    },
    {
      title: 'Doctors',
      endpoint: '/api/doctors/export-excel',
      fileName: 'doctors',
    },
    {
      title: 'Medical Records',
      endpoint: '/api/medical-records/export-excel',
      fileName: 'medical-records',
    },
    {
      title: 'Departments',
      endpoint: '/api/departments/export',
      fileName: 'departments',
    },
    {
      title: 'Procedures',
      endpoint: '/api/procedures/export-excel',
      fileName: 'procedures',
    },
    {
      title: 'Fee Policies',
      endpoint: '/api/fee-policies/export-excel',
      fileName: 'fee-policies',
    },
  ];

  const handleDownload = async (item: DownloadItem) => {
    setLoading(item.title);
    setSuccess('');
    setError('');

    try {
      const response = await fetch(`${API_BASE}${item.endpoint}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Download failed');
      }

      const arrayBuffer = await response.arrayBuffer();

      const blob = new Blob([arrayBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${item.fileName}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccess(`${item.title} Excel downloaded successfully!`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Download Reports
      </h1>

      {success && <SuccessMessage msg={success} />}
      {error && <ErrorMessage msg={error} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {downloadList.map((item) => (
          <div
            key={item.title}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold mb-4 text-center">
              {item.title}
            </h2>

            <div className="flex justify-center">
              <Button
                onClick={() => handleDownload(item)}
                disabled={loading === item.title}
              >
                {loading === item.title
                  ? 'Downloading...'
                  : `Download ${item.title}`}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllDownloads;
