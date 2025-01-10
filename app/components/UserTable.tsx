import { useState, useMemo, useEffect } from 'react';
import { Listbox } from '@headlessui/react';
import { User, UserTableProps } from '@/app/interface/index';

const UserTable: React.FC<UserTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<'first_name' | 'email' | 'job_title'>('first_name');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row).some((cell) => cell.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    return filteredData.sort((a, b) => {
      if (sortKey === 'first_name') return a.first_name.localeCompare(b.first_name);
      if (sortKey === 'email') return a.email.localeCompare(b.email);
      return a.job_title.localeCompare(b.job_title);
    });
  }, [filteredData, sortKey]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
        <Listbox value={sortKey} onChange={setSortKey}>
          <Listbox.Button className="p-2 border rounded">
            Sort by: {sortKey}
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 bg-white border rounded shadow-lg">
            {['first_name', 'email', 'job_title'].map((key) => (
              <Listbox.Option
                key={key}
                value={key}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {key}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">First Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Job Title</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 border">{row.first_name}</td>
              <td className="p-2 border">{row.email}</td>
              <td className="p-2 border">{row.job_title}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="mx-1 p-2 border rounded bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: Math.ceil(sortedData.length / itemsPerPage) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`mx-1 p-2 border rounded ${
              currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(sortedData.length / itemsPerPage)}
          className="mx-1 p-2 border rounded bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserTable;
