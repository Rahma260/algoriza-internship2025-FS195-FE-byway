import React, { useEffect, useState } from 'react';
import { InstructorProvider, useInstructorContext } from '../Components/Context/InstructorContext';
import { useInstructorForm } from '../Components/Hooks/UseInstructorForm';
import { useInstructorModal } from '../Components/Hooks/UseInstructorModal';
import Sidebar from '../Components/Sidebar/Sidebar';
import AdminHeader from '../Components/Dashboard/DashboardHeader';
import InstructorActions from '../Components/Instructors/InstructorActions';
import InstructorTable from '../Components/Instructors/InstructorTable';
import InstructorPagination from '../Components/Instructors/InstructorPagination';
import InstructorForm from '../Components/Instructors/InstructorForm';
import InstructorViewModal from '../Components/Instructors/InstructorViewModal';
import InstructorDeleteModal from '../Components/Instructors/InstructorDeleteModal';
import ModalWrapper from '../Components/Instructors/ModalWrapper';

const DashboardInstructorsContent = () => {
  const {
    error,
    setError,
    currentPage,
    searchTerm,
    filterJobTitle,
    fetchInstructors,
    fetchInstructorById,
    createInstructor,
    updateInstructor,
    deleteInstructor,
    setSelectedInstructor,
    selectedInstructor,
    totalInstructors
  } = useInstructorContext();

  const { isModalOpen, modalType, openModal, closeModal } = useInstructorModal();
  const {
    formData,
    isSaving,
    setIsSaving,
    resetForm,
    loadInstructor,
    handleFileChange,
    updateField,
    buildFormData
  } = useInstructorForm();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    fetchInstructors(currentPage, searchTerm, filterJobTitle);
  }, [currentPage, searchTerm, filterJobTitle]);

  const handleAddClick = () => {
    resetForm();
    openModal('add');
  };

  const handleViewClick = async (instructor) => {
    const fullInstructor = await fetchInstructorById(instructor.id);
    if (fullInstructor) {
      setSelectedInstructor(fullInstructor);
      openModal('view');
    }
  };

  const handleEditClick = async (instructor) => {
    const fullInstructor = await fetchInstructorById(instructor.id);
    if (fullInstructor) {
      loadInstructor(fullInstructor);
      setSelectedInstructor(fullInstructor);
      openModal('edit');
    }
  };

  const handleDeleteClick = (instructor) => {
    setSelectedInstructor(instructor);
    setDeleteError(null);
    openModal('delete');
  };

  const handleSaveInstructor = async (e) => {
    e.preventDefault();
    if (isSaving || formData.description.length < 100) return;
    if (modalType === 'add' && !formData.image) {
      setError('Please select an image.');
      return;
    }

    setIsSaving(true);
    setError(null);

    const formDataToSend = buildFormData(modalType);
    const result = modalType === 'add'
      ? await createInstructor(formDataToSend)
      : await updateInstructor(formData.id, formDataToSend);

    if (result.success) {
      closeModal();
      resetForm();
    } else {
      setError(result.error);
    }
    setIsSaving(false);
  };

  const handleConfirmDelete = async () => {
    setIsSaving(true);
    setDeleteError(null);

    const result = await deleteInstructor(selectedInstructor.id);

    if (result.success) {
      closeModal();
      setDeleteError(null);
    } else {
      setDeleteError(result.error);
    }
    setIsSaving(false);
  };

  const handleModalClose = () => {
    closeModal();
    setError(null);
    setDeleteError(null);
    resetForm();
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'add': return 'Add Instructor';
      case 'edit': return 'Edit Instructor';
      case 'view': return 'View Instructor';
      case 'delete': return 'Delete Instructor';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-inter flex flex-col">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 md:ml-64">
        <AdminHeader
          title="Instructors"
          subtitle="Manage instructors"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="p-6">
          {error && modalType !== 'delete' && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <main>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <InstructorActions onAddClick={handleAddClick} />

              <InstructorTable
                onView={handleViewClick}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onAdd={handleAddClick}
              />

              <InstructorPagination />
            </div>
          </main>

          {isModalOpen && (
            <ModalWrapper title={getModalTitle()} onClose={handleModalClose}>
              {(modalType === 'add' || modalType === 'edit') && (
                <InstructorForm
                  formData={formData}
                  onFieldChange={updateField}
                  onFileChange={(e) => handleFileChange(e, setError)}
                  onSubmit={handleSaveInstructor}
                  isSaving={isSaving}
                  onCancel={handleModalClose}
                  mode={modalType}
                />
              )}

              {modalType === 'view' && selectedInstructor && (
                <InstructorViewModal
                  instructor={selectedInstructor}
                  onEdit={handleEditClick}
                  onClose={handleModalClose}
                />
              )}

              {modalType === 'delete' && selectedInstructor && (
                <InstructorDeleteModal
                  instructor={selectedInstructor}
                  onConfirm={handleConfirmDelete}
                  onCancel={handleModalClose}
                  isDeleting={isSaving}
                  deleteError={deleteError}
                />
              )}
            </ModalWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardInstructors = () => {
  return (
    <InstructorProvider>
      <DashboardInstructorsContent />
    </InstructorProvider>
  );
};

export default DashboardInstructors;