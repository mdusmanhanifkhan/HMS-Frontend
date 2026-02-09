// import React, { useState } from 'react';
// import * as Yup from 'yup';
// import Button from '../../components/button/Button';
// import SuccessMessage from '../../components/error-handling/SuccessMessage';
// import ErrorMessage from '../../components/error-handling/ErrorMessage';

// interface Errors {
//   [key: string]: string;
// }

// const DownloadPatients: React.FC = () => {
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState('');
//   const [error, setError] = useState('');
//   const [errors, setErrors] = useState<Errors>({});

//   const API_BASE = import.meta.env.VITE_API_BASE_URL;
//   const token = localStorage.getItem('token') || '';

//   // Optional: Add validation if needed (for example date range)
//   const schema = Yup.object().shape({});

//   const handleDownload = async () => {
//     setLoading(true);
//     setSuccess('');
//     setError('');
//     setErrors({});

//     try {
//       // Validate (currently empty schema)
//       await schema.validate({}, { abortEarly: false });

//       // Fetch patients Excel
//       const response = await fetch(`${API_BASE}/api/patients/export`, {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const text = await response.text();
//         throw new Error(text || 'Failed to download patients Excel');
//       }

//       // Read as ArrayBuffer
//       const arrayBuffer = await response.arrayBuffer();

//       // Convert to Blob
//       const blob = new Blob([arrayBuffer], {
//         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//       });

//       // Download link
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `patients.xlsx`;
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);

//       setSuccess('Patients Excel downloaded successfully!');
//     } catch (err: unknown) {
//       if (err instanceof Yup.ValidationError) {
//         const validationErrors: Errors = {};
//         err.inner.forEach((e) => {
//           if (e.path) validationErrors[e.path] = e.message;
//         });
//         setErrors(validationErrors);
//       } else if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError('An unexpected error occurred');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-10">
//       <h1 className="text-2xl font-semibold mb-6 text-center">
//         Download Patients Excel
//       </h1>

//       {success && <SuccessMessage msg={success} />}
//       {error && <ErrorMessage msg={error} />}

//       <div className="flex justify-center">
//         <Button
//           onClick={handleDownload}
//           disabled={loading}
//           className="w-fit"
//         >
//           {loading ? 'Downloading...' : 'Download Patients Excel'}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default DownloadPatients;



const Download = () => {
  return (
    <div>Download</div>
  )
}

export default Download