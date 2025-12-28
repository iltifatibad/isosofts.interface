// MyTableBody.jsx (ayrı bir dosya olarak kaydedin)
import React from "react";
import { useState, useEffect } from "react";
import { hCheckboxChange } from "../profile.jsx";
const ActionBody = ({
  selectedRows,
  selectedRowsForActions,
  showArchived,
  onCheckboxChange,
  onCheckboxChangeForActions,
  showDeleted,
  showDeletedAction,
  setSelectedRows,
  setSelectedTable,
  activeHeader,
  selectedTable,
  refresh,
  setRefresh,
}) => {
  console.log("ACTIVE HEADERRRRR : ", activeHeader);
  const [archivedData, setArchivedData] = useState([]);
  const [deletedData, setDeletedData] = useState([]);
  const [deletedActionData, setDeletedActionData] = useState([]);
  const [archivedActionData, setArchivedActionData] = useState([]);
  const [actionData, setActionData] = useState([]);
  const [editData, setEditData] = useState([]);


  useEffect(() => {
    if (refresh) {
      if (!showArchived & !showDeleted & !showDeletedAction & activeHeader) {
        const timer = setTimeout(() => {
          getAll();
          setRefresh(false);
        }, 500);

        return () => clearTimeout(timer); // cleanup
      } else if (showArchived) {
        const timer = setTimeout(() => {
          getArchivedData();
          setRefresh(false);
        }, 500);

        return () => clearTimeout(timer); // cleanup
      } else if (showDeleted) {
        const timer = setTimeout(() => {
          getDeletedData();
          setRefresh(false);
        }, 500);

        return () => clearTimeout(timer); // cleanup
      } else if (!activeHeader) {
        const timer = setTimeout(() => {
          getAllActions();
          setRefresh(false);
        }, 500);
        return () => clearTimeout(timer); // cleanup
      } else if ((activeHeader == false) & (showDeletedAction == true)) {
        const timer = setTimeout(() => {
          getDeletedActionData();
          console.log("HERE HERE HERE");
          setRefresh(false);
        }, 500);
        return () => clearTimeout(timer); // cleanup
      }
    }
  }, [refresh]);

  useEffect(() => {
    if (showArchived) {
      getArchivedData(); // Async çağrı
    } else {
      setArchivedData([]); // Normal moda geçince temizle (opsiyonel)
    }
  }, [showArchived]); // Dependency: showArchived değişince

  const getDeletedData = async () => {
    setLoading(true); // Loading başla
    try {
      const response = await fetch(
        "/api/dashboard/actionLog/all?status=deleted",
      );
      if (!response.ok) {
        throw new Error("Failed To Get Datas From Deleted DataBase");
      }
      const fetchedData = await response.json();
      setDeletedData(fetchedData || []); // Veri set et, fallback []
      console.log("Arşiv verileri:", fetchedData);
    } catch (err) {
      console.error("Error While Fetching Deleted Datas:", err);
      setDeletedData([]); // Hata durumunda boş array set et (null değil!)
    } finally {
      setLoading(false); // Loading bitir
    }
  };
  useEffect(() => {
    if (showDeleted) {
      getDeletedData(); // Async çağrı
    } else {
      setDeletedData([]); // Normal moda geçince temizle (opsiyonel)
    }
  }, [showDeleted]); // Dependency: showArchived değişince

  const getDeletedActionData = async () => {
    setLoading(true); // Loading başla
    const selectedRowsArray = [...selectedRows];
    try {
      const firstRowId = selectedRowsArray[0];
      const url = `/api/dashboard/actionLog/all?status=deleted`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed To Get Datas From Deleted DataBase");
      }
      const fetchedData = await response.json();
      setDeletedActionData(fetchedData || []); // Veri set et, fallback []
      console.log("Arşiv Action verileri:", fetchedData);
    } catch (err) {
      console.error("Error While Fetching Deleted Datas:", err);
      setDeletedActionData([]); // Hata durumunda boş array set et (null değil!)
    } finally {
      setLoading(false); // Loading bitir
    }
  };


  const getArchivedActionData = async () => {
    setLoading(true); // Loading başla
    const selectedRowsArray = [...selectedRows];
    try {
      const firstRowId = selectedRowsArray[0];
      const url = `/api/dashboard/actionLog/all?status=archived`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed To Get Datas From Deleted DataBase");
      }
      const fetchedData = await response.json();
      setDeletedActionData(fetchedData || []); // Veri set et, fallback []
      console.log("Arşiv Action verileri:", fetchedData);
    } catch (err) {
      console.error("Error While Fetching Deleted Datas:", err);
      setDeletedActionData([]); // Hata durumunda boş array set et (null değil!)
    } finally {
      setLoading(false); // Loading bitir
    }
  };

  useEffect(() => {
    if (!activeHeader && showDeletedAction) {
      getDeletedActionData(); // Async çağrı
    } else {
      setDeletedActionData([]); // Normal moda geçince temizle (opsiyonel)
    }
  }, [showDeletedAction]); // Dependency: showArchived değişince

  useEffect(() => {
    if (!activeHeader && showArchived) {
      getArchivedActionData(); // Async çağrı
    } else {
      setArchivedActionData([]); // Normal moda geçince temizle (opsiyonel)
    }
  }, [showArchived]); // Dependency: showArchived değişince

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tableData, setTableData] = useState([]);
  const getAll = async () => {
    setLoading(true);
    fetch("/api/dashboard/actionLog/all")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed To Get Datas From Database");
        }
        return response.json();
      })
      .then((fetchedData) => {
        setTableData(fetchedData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!activeHeader) {
      getAll();
    } else {
      console.log("");
    }
  }, [showArchived, showDeleted]);

  const getAllActions = async () => {
    setLoading(true);

    // const firstRowId = selectedRowsArray[0]; // Artık ID'yi alabilirsin: "I234884J501LA657g6S20N2Nc2V71p"
    const url = `/api/dashboard/actionLog/all?status=active`;

    console.log("URL:", url); // Debug: URL'yi konsola yazdır, registerId'yi kontrol et

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("AAA", selectedRows); // Bu zaten Set'i gösteriyor
        if (!response.ok) {
          throw new Error(
            `Failed To Get Actions: ${response.status} - ${response.statusText}`,
          );
        }
        return response.json();
      })
      .then((data) => {
        // Başarılı veriyi işle, örneğin setActions(data);
        console.log("Fetched data:", data); // Debug için ekle
        setActionData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch hatası:", err); // Hata detayını logla
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
      // selectedRows.size ile Set'in boş olup olmadığını kontrol et
      getAllActions();
      console.log("Function Running");
    
  }, [activeHeader, selectedRows]); // Dependency array ekle: selectedRows değişirse tekrar çalışsın
  if (loading) return;
  if (error) return;
  const SoftBadge = ({ value, color }) =>
    value ? (
      <span
        className={`inline-block px-2 py-1 rounded-full text-sm font-medium shadow-sm ${color}`}
      >
        {value}
      </span>
    ) : null;


    // 🟩 Normal (aktif) tablo
  return (
  <tbody className="text-sm">
    {loading ? (
      <tr>
        <td colSpan={25} className="text-center py-6 text-gray-600">
          Arşiv verileri yükleniyor...
        </td>
      </tr>
    ) : !actionData || actionData.length === 0 ? (
      <tr>
        <td colSpan={25} className="text-center py-6 text-gray-500">
          No Data
        </td>
      </tr>
    ) : (
      actionData.map((row, index) => {
        const numActions = row.actions ? row.actions.length : 1;
        const actions = Array.isArray(row.actions) ? row.actions : [row.actions];
        return (
          <React.Fragment key={row.id}>
            {actions.map((action, actionIndex) => (
              <tr
                key={`${row.id}-${action.id || actionIndex}`}
                className={`border-b h-16 min-h-16 align-middle border-gray-200 ${
                  (index + actionIndex) % 2 === 0 ? "bg-white hover:bg-gray-200" : "bg-green-100 hover:bg-green-200"
                }`}
              >
                {/* # column - Her action row için ayrı row.no göster */}
                <td className="border-b border-gray-200 px-2 py-1 w-16 sticky left-[-1px] top-0 z-10 bg-white -ml-px">
                  <SoftBadge value={row.no || ""} />
                </td>
                {/* FIRST ACTION PLAN FIELDS - Hepsi action'dan */}
                <td className="border-b border-gray-200 px-2 py-1 w-32">
                  <SoftBadge value={action.title || ""} />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-32">
                  <SoftBadge value={action.raiseDate || ""} />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-24">
                  <SoftBadge value={action.resources?.toString() || ""} />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-28">
                  <SoftBadge value={action.relativeFunction?.value || ""} />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-28">
                  <SoftBadge value={action.responsible?.value || ""} />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-24">
                  <SoftBadge value={action.deadline || ""} />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-36">
                  <SoftBadge value={action.confirmation?.value || ""} />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-24">
                  <SoftBadge value={action.status?.value?.toString() || ""} />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-24">
                  <SoftBadge value={action.completionDate || ""} />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-32">
                  <SoftBadge value={action.verificationStatus?.value || ""} />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-40">
                  <SoftBadge value={action.comment || ""} />
                </td>
                {/* MONITORING MONTH COLUMNS - action'dan */}
                {[
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"
                ].map((month) => {
                  const monthKey = month.toLowerCase();
                  const monthValue = action[monthKey]?.value || "";
                  return (
                    <td
                      key={`${row.id}-${action.id || actionIndex}-${monthKey}`}
                      className="border-b border-gray-200 px-2 py-1 w-24"
                    >
                      <SoftBadge value={monthValue} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </React.Fragment>
        );
      })
    )}
  </tbody>
);
  
};

export default ActionBody;
