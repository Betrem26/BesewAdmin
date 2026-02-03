import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import axios from "axios";

// import Swal from "sweetalert2";

interface Company {
  company_name: string;
  [key: string]: any;
}

interface AddVacancyModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

function AddVacancyModal({ showModal, setShowModal }: AddVacancyModalProps) {
  const userData = useSelector((store: RootState) => store.user);

  const [jobData, setJobData] = useState<any>({
    employer_type: { id: 1, name: "Company" },
    employer: "",
    job_data: "",
    company_data: "",
    job_catagory: "",
    jobCategory: "",
    job_title: "",
    job_location: "",
    applicants_needed: 1,
    job_type: "",
    working_location: "",
    jobLevel: "",
    education: "",
    minExperience: "0",
    maxExperience: "0",
    skills: [],
    attitude: [],
    job_description: "",
    jobResponsibility: "",
    fieldOfStudy: [],
    competencyList: [],
    save_template: false,
    companyRequirements: [],
    gender: { id: 1, name: "both" },
    deadline: "",
    employment_type: {},
    currency: "ETB",
    minSalary: 1500,
    maxSalary: 0,
    pointOfContact: true,
  });

  // const [inputError, setinputError] = useState({
  //   job_data: "",
  //   job_catagory: "",
  //   job_title: "",
  //   job_location: "",
  //   appplicants_needed: "",
  //   job_type: "",
  //   working_location: "",
  //   jobLevel: "",
  //   company_data: "",
  //   education: "",
  //   min_experience: "",
  //   max_experience: "",
  //   skills: "",
  //   attitude: "",
  //   company_background: "",
  //   min_salary: "",
  //   max_salary: "",
  //   deadline: "",
  //   job_description: "",
  //   jobResponsibility: "",
  //   fieldOfStudy: [],
  //   employment_type: {},
  //   currency: "",
  //   pointOfContact: "",
  //   jobCategory: "",
  // });

  const [allJob, setAllJob] = useState([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  // const [selectedDrop, setselectedDrop] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  console.log(allJob, companies, categoryList);
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${userData?.accessToken}`,
      };
      const res = await axios.get("https://job.job.addispay.et/job-common", {
        headers,
      });
      setAllJob(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("https://job.party.addispay.et/company-data");
      if (Array.isArray(res.data)) {
        setCompanies(res.data);
      } else {
        console.error("Companies data is not an array:", res.data);
        setCompanies([]);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      setCompanies([]);
    }
  };

  // const updatedCompanies = Array.isArray(companies)
  //   ? companies
  //       .filter(
  //         (company) =>
  //           company?.company_name &&
  //           typeof company.company_name === "string" &&
  //           company.company_name.trim() !== ""
  //       )
  //       .map((company) => ({
  //         name: company.company_name,
  //         ...company,
  //       }))
  //   : [];

  const [levelList, setlevelList] = useState<string[]>([]);
  console.log(levelList);

  useEffect(() => {
    if (Array.isArray(jobData.competencyList)) {
      const list = jobData.competencyList
        .filter((item) => item && item.jobLevel)
        .map((item) => item.jobLevel);

      setlevelList(list);

      if (jobData.competencyList.length > 0 && jobData.competencyList[0]) {
        setJobData({
          ...jobData,
          jobLevel: jobData.competencyList[0].jobLevel || "",
          education: jobData.competencyList[0].education || "",
        });
      }
    }
  }, [jobData.job_data]);

  // const updatedjobData = Array.isArray(allJob)
  //   ? allJob
  //       .filter(
  //         (job) =>
  //           job?.jobName &&
  //           typeof job.jobName === "string" &&
  //           job.jobName.trim() !== ""
  //       )
  //       .map((obj) => {
  //         const { jobName, ...rest } = obj;
  //         return { name: jobName, ...rest };
  //       })
  //   : [];

  useEffect(() => {
    fetchJobs();
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://jobs.besewonline.com/job-category"
        );
        const data = await response.json();
        setCategoryList(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // const handleInputChange =
  //   (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setJobData({ ...jobData, [field]: e.target.value });
  //   };

  // const handleSave = async () => {
  //   if (!jobData.company_data?.name || !jobData.job_title) {
  //     Swal.fire({
  //       title: "Missing Information",
  //       text: "Please fill in all required fields",
  //       icon: "error",
  //       confirmButtonText: "OK",
  //     });
  //     return;
  //   }

  //   const payload = {
  //     party_id: "admin",
  //     employerType: jobData.employer_type,
  //     employer: jobData.company_data.name,
  //     jobData: jobData.job_catagory,
  //     companyData: jobData.company_data,
  //     jobCategory: jobData.job_catagory?.name || "",
  //     jobTitle: jobData.job_title,
  //     jobLocation: "Location XYZ",
  //     jobLevel: jobData.jobLevel,
  //     applicantsNeeded: String(jobData.applicants_needed),
  //     jobType: jobData.employment_type,
  //     workingLocation: "Office",
  //     educationLevel: jobData.education,
  //     deadline: jobData.deadline,
  //     minExperience: String(jobData.minExperience),
  //     maxExperience: String(jobData.maxExperience),
  //     maxSalary: Number(jobData.maxSalary) || 0,
  //     minSalary: Number(jobData.minSalary) || 1500,
  //     skills: Array.isArray(jobData.skills) ? jobData.skills : [],
  //     attitude: Array.isArray(jobData.attitude) ? jobData.attitude : [],
  //     jobDescription: jobData.job_description,
  //     jobResponsibility: jobData.jobResponsibility,
  //     companyLocation: { lat: "location xyz" },
  //     verified: true,
  //     posted: true,
  //     gender: jobData.gender,
  //     hasPointOfContact: jobData.pointOfContact,
  //     fieldOfStudy: Array.isArray(jobData.fieldOfStudy)
  //       ? jobData.fieldOfStudy
  //       : [],
  //     evaluationCriteria: ["education"],
  //     currency: "ETB",
  //     companyRequirements: jobData.job_data?.jobEnvironment || [],
  //     evaluator: jobData.company_data?.name || "",
  //     country: "Ethiopia",
  //     logo: jobData?.company_data?.logo || "",
  //     vacancy_id: 688666,
  //     status: "active",
  //   };

  //   try {
  //     const response = await fetch("https://jobs.besewonline.com/vacancies", {
  //       method: "POST",
  //       headers: {
  //         accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       const errorMessage = Array.isArray(data.message)
  //         ? data.message.join(", ")
  //         : "Failed to add vacancy";

  //       Swal.fire({
  //         title: "Can't add vacancy",
  //         text: errorMessage,
  //         icon: "error",
  //         confirmButtonText: "OK",
  //       });
  //     } else {
  //       Swal.fire({
  //         title: "Success",
  //         text: "Vacancy created successfully!",
  //         icon: "success",
  //         confirmButtonText: "OK",
  //       }).then(() => {
  //         setShowModal(false);
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error saving vacancy:", error);
  //     Swal.fire({
  //       title: "Error",
  //       text: "Failed to save vacancy. Please try again.",
  //       icon: "error",
  //       confirmButtonText: "OK",
  //     });
  //   }
  // };

  useEffect(() => {
    const selected = jobData?.competencyList?.filter(
      (item) => item.jobLevel?.name == jobData.jobLevel.name
    )[0];

    if (selected) {
      setJobData({
        ...jobData,
        attitude: selected.attitude,
        education: selected.education,
        skills: selected.skill,
        fieldOfStudy: selected.fieldOfStudies,
      });
    }
  }, [jobData.jobLevel]);

  // const genderOptions = [
  //   { id: 1, name: "both" },
  //   { id: 2, name: "female" },
  //   { id: 3, name: "male" },
  // ];

  // const options = [
  //   { id: 1, name: "Yes", value: true },
  //   { id: 2, name: "No", value: false },
  // ];

  const languages = [
    { code: "en", name: "English" },
    { code: "am", name: "አማርኛ" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "zh", name: "Chinese" },
    { code: "", name: "All" },
  ];

  const [selectedLang, setSelectedLang] = useState(languages[0]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = languages.find((lang) => lang.code === e.target.value);
    setSelectedLang(selected || languages[0]);
    setJobData({
      ...jobData,
      employer_type: { id: 1, name: "Company" },
      employer: "",
      job_data: "",
      company_data: "",
      jobCategory: "",
      job_catagory: "",
      job_title: "",
      job_location: "",
      applicants_needed: 1,
      job_type: "",
      working_location: "",
      jobLevel: "",
      education: "",
      minExperience: "0",
      maxExperience: "0",
      skills: [],
      attitude: [],
      job_description: "",
      jobResponsibility: "",
      fieldOfStudy: [],
      competencyList: [],
      save_template: false,
      companyRequirements: [],
      gender: { id: 1, name: "both" },
      deadline: "",
      employment_type: {},
      currency: "ETB",
      minSalary: 1500,
      maxSalary: 0,
      pointOfContact: true,
    });
  };

  // const updatedCategories =
  //   categoryList && Array.isArray(categoryList)
  //     ? categoryList
  //         .filter(
  //           (category: any) =>
  //             typeof category?.categoryName === "string" &&
  //             category.categoryName.trim() !== ""
  //         )
  //         .map((category: any) => ({
  //           name: category.categoryName,
  //           id: category._id,
  //           ...category,
  //         }))
  //     : [];

  return (
    showModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
          <button
            className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
            onClick={() => setShowModal(false)}
          >
            &times;
          </button>
          <h2 className="text-2xl font-semibold mb-4">Add New Vacancy</h2>
          {loading ? (
            <div className="text-center">Loading jobs...</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="w-64">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Language
                </label>
                <select
                  value={selectedLang.code}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Add your remaining form fields here */}
            </div>
          )}
        </div>
      </div>
    )
  );
}

export default AddVacancyModal;
