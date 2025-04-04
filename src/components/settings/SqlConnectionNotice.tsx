
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface SqlConnectionNoticeProps {
  sqlDbConnected: boolean;
}

const SqlConnectionNotice = ({ sqlDbConnected }: SqlConnectionNoticeProps) => {
  if (sqlDbConnected) return null;
  
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start space-x-3">
      <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
      <div>
        <h3 className="font-medium text-yellow-800">SQL Connection Notice</h3>
        <p className="text-sm text-yellow-700">
          The connection to the SQL database is not working. The system is currently using local storage for data persistence.
          This is fine for testing purposes but not recommended for production use.
        </p>
      </div>
    </div>
  );
};

export default SqlConnectionNotice;
