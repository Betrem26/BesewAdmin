import type React from "react"
import { useEffect, useState } from "react"
import CustomCard from "../../components/atoms/cards/CustomCard"
import Text from "../../components/atoms/texts/CustomText"

import Button from "../../components/atoms/buttons/CustomButton"
import { Button as SubmitButton } from "@mui/material"
import { type CommonJob, type Competency, Language } from "./common-job.type"
import theme from "../../themes/Theme"
import axios from "axios"
//import { handleSetCommonJob } from "./errorHandling";
import { IoIosArrowBack, IoIosDoneAll } from "react-icons/io"
import { useSelector } from "react-redux"
import type { RootState } from "../../store/store"
import { MdDelete } from "react-icons/md"
import { BasicSelect } from "./components/DefaultSelect"
import { TextInput } from "./components/inputs"
import MultipleSelectChip from "./components/ChipMultipleSelect"
import DialogSelect from "./components/WithDialog"
import LoadingSpinner from "./components/Loading"
import MultipleSelectNative from "./components/NativeSelect"
import { RiEdit2Fill } from "react-icons/ri"
// import JobBackgorund from '../../assets/images/website_background.jpeg'
import "./addCommonJob.css"
import { IoClose } from "react-icons/io5"
const JobAdd: React.FC<{ backHome: (value: boolean) => void }> = ({ backHome }) => {
  const userData = useSelector((store: RootState) => store.user)

  const [commonJob, setCommonJob] = useState<CommonJob>({
    party_id: userData?.user.account_id,
    jobCategoryId: "567876",
    jobCategory: { id: 1, name: "catgory" },
    jobId: "jobid123",
    jobName: "title",
    jobDescription: "description",
    jobResponsibility: "",
    language: Language.ENGLISH,
    addedByAdmin: true,
    competency: [],
    jobEnvironment: [],
  })

  const [category, setCategory] = useState("")
  const [categoryList, setCategoryList] = useState<any>()

  const [jobTitleList, setJobTitleList] = useState<any>({})
  const [jobTitle, setJobTitle] = useState("")
  // const [openList, setOpenList] = useState(false)
  const [environment, setEnvironment] = useState("")
  const [description, setDescription] = useState("")

  const [responsibility, setResponsibility] = useState("")

  //
  const [error, setError] = useState<string[]>([])
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [openCompetency, setOpenCompetency] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  //
  const [isComptentecyEdit, setCompetencyEdit] = useState(false)
  const [clickedComptency, setClickedComptency] = useState<number | null>(null)
  const [editCompetencyData, setEditCompetencyData] = useState<Competency | null>(null)
  console.log(editCompetencyData)

  // const setClieckedCompetency = (index:number)=>{
  //   setClickedComptency(index)
  // }
  const editCompetency = (id: string) => {
    setCompetencyEdit(true)
    console.log("entered to the realm")

    // Find the competency object with the given ID
    const competencyToEdit = commonJob?.competency.find((competency) => competency.id === id)

    // If the competency is found
    if (competencyToEdit) {
      // Set the edit competency data state
      setEditCompetencyData(competencyToEdit)
      setOpenCompetency(true)
    } else {
      // Handle the case where the competency is not found
      console.log("Competency not found.")
    }
  }

  const handleLanguage = (language: any) => {
    setCommonJob((prev: CommonJob) => {
      return { ...prev, language: language?.target.value }
    })
  }

  const addEnvironment = (key: keyof CommonJob, newValue: any) => {
    setCommonJob((prev: CommonJob) => {
      const prevArray = prev[key] as any[]
      setCompetencyEdit(false)
      setEditCompetencyData(null)
      setClickedComptency(null)
      if (Array.isArray(prevArray)) {
        if (newValue) {
          if (key === "competency") {
            const filteredCompetency = commonJob.competency.filter((competency) => {
              return competency.id !== newValue.id
            })

            return { ...prev, [key]: [...filteredCompetency, newValue] }
          }
          const trimmedName = newValue.name.trim()

          const isDuplicate = prevArray.some((item: any) => item.name === trimmedName)

          if (!isDuplicate && newValue?.name?.length > 0) {
            return { ...prev, [key]: [...prevArray, newValue] }
          }
        } else {
          console.error("newValue is missing name property")
        }
      }
      return prev
    })
  }

  const addCompetency = (competency: any) => {
    addEnvironment("competency", competency)
  }

  const removeEnvironment = (key: keyof CommonJob, objectToRemove: any) => {
    setCommonJob((prev: CommonJob) => {
      if (prev !== undefined) {
        const prevArray = prev[key] as any[]
        const updatedArray = prevArray.filter((item: any) => item !== objectToRemove)
        return { ...prev, [key]: updatedArray }
      }
      return prev
    })
  }

  const getLastArray = (key: keyof CommonJob) => {
    const array = commonJob[key]

    if (Array.isArray(array)) {
      const lastElement = array[array?.length - 1] as any

      if (lastElement && typeof lastElement.id === "number") {
        return lastElement.id + 1
      } else {
        console.error("Could not retrieve last element id from CommonJob[", key, "]")
        return 1
      }
    } else {
      return 1
    }
  }

  const addCategoryAndTitle = (
    updatedCategory: any,
    updatedJobtitle: string,
    jobDescription: string,
    jobResponsibility: string,
  ) => {
    setCommonJob((prev: CommonJob) => {
      return {
        ...prev,
        jobCategory: { id: 1, name: updatedCategory },
        jobName: updatedJobtitle,
        jobDescription: jobDescription,
        jobResponsibility: jobResponsibility,
      }
    })
  }

  useEffect(() => {
    addCategoryAndTitle(category, jobTitle, description, responsibility)
  }, [category, jobTitle, description, responsibility])

  const submitJob = async () => {
    try {
      // Define your request headers with the token
      const headers = {
        Authorization: `Bearer ${userData?.accessToken}`,
        "Content-Type": "application/json",
      }

      // Validation
      const validationErrors = []
      if (!commonJob.jobName || commonJob.jobName === "title") validationErrors.push("Job title is required")
      if (!category) validationErrors.push("Job category is required")
      if (!description) validationErrors.push("Job description is required")
      if (!responsibility) validationErrors.push("Job responsibility is required")
      if (commonJob.competency.length === 0) validationErrors.push("At least one competency level is required")

      if (validationErrors.length > 0) {
        setError(validationErrors)
        return
      }

      setLoading(true)

      // Helper function to convert Language enum to API format
      const getLanguageForAPI = (language: Language) => {
        const languageMap = {
          [Language.ENGLISH]: { code: "en", name: "English" },
          [Language.Amaharic]: { code: "am", name: "Amharic" },
        }
        return languageMap[language] || { code: "en", name: "English" }
      }

      // Find the selected category to get the correct ID
      const selectedCategoryObj = categoryList?.find((cat) => cat.categoryName === category)

      // Prepare the payload according to the API structure
      const jobPayload = {
        party_id: commonJob.party_id,
        jobCategoryId: selectedCategoryObj?.id?.toString() || commonJob.jobCategoryId,
        jobCategory: {
          id: selectedCategoryObj?.id || 1,
          name: category || commonJob.jobCategory.name,
        },
        language: getLanguageForAPI(commonJob.language),
        jobName: jobTitle || commonJob.jobName,
        jobDescription: description || commonJob.jobDescription,
        jobResponsibility: responsibility || commonJob.jobResponsibility,
        addedByAdmin: commonJob.addedByAdmin,
        competency: commonJob.competency.map((comp) => ({
          jobLevel: comp.jobLevel,
          education: typeof comp.education === "string" ? comp.education : comp.education.name,
          fieldOfStudies: comp.fieldOfStudies || [],
          skill: comp.skill || [],
          attitude: comp.attitude || [],
          // Add default values for missing properties
          experience: (comp as any).experience || { min: 0, max: 1 },
          salary: (comp as any).salary || {
            type: "fixed",
            standard: "monthly",
            currency: "ETB",
            fixedAmount: 5000,
            notes: "To be negotiated",
          },
        })),
        jobEnvironment: commonJob.jobEnvironment,
      }

      console.log("Submitting job payload:", jobPayload)

      const response = await axios.post(`https://jobs.besewonline.com/job-common`, jobPayload, { headers })

      console.log("Job created successfully:", response.data)
      setLoading(false)
      setSuccess(true)
    } catch (error: any) {
      console.log("Error creating job:", error)

      if (error.response?.data?.message) {
        setError([error.response.data.message])
      } else if (error.response?.status === 500) {
        setError([
          "Failed to create job. Please check all required fields and ensure competency levels have experience and salary information.",
        ])
      } else {
        setError(["An error occurred while creating the job."])
      }

      setSuccess(false)
      setLoading(false)
    }
  }

  const getCategorys = async () => {
    const headers = {
      Authorization: `Bearer ${userData?.accessToken}`,
    }
    await axios
      .get("https://jobs.besewonline.com/job-category", { headers })
      .then((res) => {
        console.log(res.data)
        setCategoryList(res.data)
        const filtered =
          res.data &&
          res.data.filter((item) => item?.lang_opt?.toLowerCase().includes(commonJob.language.toLocaleLowerCase()))
        setFilteredCategory(filtered)
      })
      .catch((error) => console.log(error))
  }
  const getTitle = async (cate: string) => {
    const headers = {
      Authorization: `Bearer ${userData?.accessToken}`,
    }

    await axios
      .get(`https://jobs.besewonline.com/job-common/job-title-by-category/${cate}`, { headers })
      .then((res) => {
        console.log("job title", res.data)
        setJobTitleList(res.data)
        // setFilteredCategory(res.data)
      })
      .catch((error) => console.log(error))
  }

  const getComptencyByTitle = async () => {
    const headers = {
      Authorization: `Bearer ${userData?.accessToken}`,
    }
    try {
      const response = await axios.get(`https://jobs.besewonline.com/job-common/get-job-by-title/${jobTitle}`, {
        headers,
      })
      console.log("job by job title", response.data)
      //setJobTitleList(response.data);
      if (response.data.competency) {
        const common = response.data
        setCommonJob((prev) => {
          return { ...prev, competency: common.competency }
        })
        setDescription(common.jobDescription)
        setResponsibility(common.jobResponsibility)
      }

      // setFilteredCategory(res.data)
    } catch (error) {
      console.error("Error fetching job by title:", error)
      // Handle error, e.g., set an error state or display a message to the user
    }
  }

  useEffect(() => {
    getTitle(commonJob.jobCategory.name)
  }, [commonJob.jobCategory])

  useEffect(() => {
    getCategorys()
  }, [])

  useEffect(() => {
    // setIsFocused(false)
    getComptencyByTitle()
  }, [jobTitle])

  const [filteredCategory, setFilteredCategory] = useState(categoryList)

  useEffect(() => {
    const filtered =
      categoryList &&
      categoryList.filter((item) => item?.lang_opt?.toLowerCase().includes(commonJob.language.toLocaleLowerCase()))
    setFilteredCategory(filtered)
  }, [commonJob.language])

  const addJobEnvironment = () => {
    if (environment.trim()) {
      const newEnv = {
        id: getLastArray("jobEnvironment"),
        name: environment.trim(),
      }

      const isDuplicate = commonJob.jobEnvironment.some(
        (item: any) => item.name.toLowerCase() === newEnv.name.toLowerCase(),
      )

      if (!isDuplicate) {
        setCommonJob((prev: CommonJob) => ({
          ...prev,
          jobEnvironment: [...prev.jobEnvironment, newEnv],
        }))
        setEnvironment("") // Clear the input after adding
      }
    }
  }

  return (
    <CustomCard
      background="linear-gradient(145deg, #2226, #fff)"
      padding="5px"
      boxShadow="0 0 5px gray"
      customCss={` z-index:1; justify-content:flex-start; gap:10px; height:100vh;overflow:scroll; position:relative; min-height:100vh;`}
      width="100%"
    >
      <div style={{ width: "100%", height: "100%", zIndex: "-1", position: "absolute", top: "0", left: "0" }} />
      <div style={{ width: "100%", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ background: "gray", color: "white", padding: "10px", borderRadius: "50%", cursor: "pointer" }}>
          <IoIosArrowBack fontSize={20} onClick={() => backHome(false)} />
        </div>
        <SubmitButton
          sx={{ padding: "10px 25px", borderWidth: "2px", fontWeight: "bold" }}
          onClick={submitJob}
          variant="outlined"
        >
          Submit
        </SubmitButton>
      </div>
      {error?.length > 0 && (
        <CustomCard
          borderRadius="10px"
          border="1px solid red"
          customCss={"position:absolute;top:40vh;gap:10px; z-index:3;align-items:flex-start"}
          padding="30px"
          boxShadow="0 0 5px gray"
        >
          <h1>Errors</h1>
          {error.map((item, index) => {
            return (
              <Text key={index} color={`${theme.colors.danger.main}`}>
                {"> "}
                {item}
              </Text>
            )
          })}
          <Button background="blue" onClick={() => setError([])}>
            <Text color="white">Close</Text>
          </Button>
        </CustomCard>
      )}
      {success && (
        <CustomCard
          borderRadius="10px"
          customCss={"position:absolute;top:40vh;gap:10px; z-index:3"}
          padding="30px"
          boxShadow="0 0 5px gray"
          background={`${theme.colors.white.light}`}
        >
          <Text color={theme.colors.success.main}>Successfully added</Text>
          <Button background={theme.colors.success.main} onClick={() => setSuccess(false)}>
            <Text color={`${theme.colors.white.light}`}>Ok</Text>
          </Button>
        </CustomCard>
      )}

      {loading && <LoadingSpinner />}
      <div className="competency-card" style={{ width: "100%", borderRadius: "10px" }}>
        <CustomCard
          border="1px solid white"
          boxShadow="0 0 5px #ccc"
          padding="10px"
          width="100%"
          customCss={"z-index:1;flex-direction:column; gap:15px; width:100%"}
          borderRadius="10px"
        >
          <div style={{ width: "100%", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            {/* language */}
            <BasicSelect
              label="Language"
              data={Object.values(Language).map((value) => {
                return value
              })}
              onChange={handleLanguage}
              value={commonJob.language}
            />
            {/* job category */}
            <BasicSelect
              label="Category"
              data={filteredCategory && filteredCategory.map((item) => item.categoryName)}
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            />
            {/* job title */}
            <div style={{ position: "relative", zIndex: "10000" }}>
              <TextInput
                setIsFocused={setIsFocused}
                type="input"
                label="Job title"
                onChange={(e) => setJobTitle(e.target.value)}
                value={jobTitle}
              />
              {isFocused && jobTitleList?.length <= 0 && (
                <div style={{ width: "80%", textAlign: "center" }}>empty list</div>
              )}
              {isFocused && jobTitleList?.length > 0 && (
                <MultipleSelectNative data={jobTitleList} setJobtitle={setJobTitle} />
              )}
            </div>
          </div>
          {/* <hr style={{width:"80%"}}/> */}
          <div style={{ display: "flex", width: "100%", flexWrap: "wrap" }}>
            {/* description */}
            <TextInput
              type="multiline-placeholder"
              label="Responsibility"
              onChange={(e) => setResponsibility(e.target.value)}
              value={responsibility}
            />
            <TextInput
              type="multiline-placeholder"
              label="Description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />

            {/* <hr style={{ width: "80%" }} /> */}
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", flexDirection: "column" }}
            >
              {/* job environment */}
              <MultipleSelectChip
                label="Job Environment"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                addEnv={addJobEnvironment}
                deleteEnv={removeEnvironment}
                data={commonJob?.jobEnvironment}
              />

              <CustomCard
                borderRadius="10px"
                border={`1px ${commonJob?.jobEnvironment.length > 0 && "solid"}  gray`}
                width="90%"
                customCss={"gap:10px;"}
              >
                <CustomCard>
                  {
                    <CustomCard width="100%" customCss={"flex-direction:row; gap:2px; flex-wrap:wrap; gap:5px"}>
                      {commonJob?.jobEnvironment?.map((item, i) => {
                        return (
                          <CustomCard
                            key={i}
                            background={theme.colors.gray.medium}
                            padding="7px"
                            borderRadius="20px"
                            customCss={"flex-direction:row; gap:4px"}
                          >
                            <Text fontSize={"xs"} color="white">
                              {item.name}
                            </Text>
                            <Button
                              padding="0"
                              onClick={() => removeEnvironment("jobEnvironment", item)}
                              background="none"
                              customStyle={"position:relative"}
                            >
                              <Text
                                background="white"
                                customStyle={"position:absolute; top:-15px; left:80%; z-index:12;border-radius:50%"}
                                fontSize={"xs"}
                                color="black"
                              >
                                {" "}
                                <IoClose />
                              </Text>
                            </Button>
                          </CustomCard>
                        )
                      })}
                    </CustomCard>
                  }
                </CustomCard>
              </CustomCard>
            </div>
          </div>
          <div style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "0 10px" }}>
              <h1>Competency</h1>
              <Button onClick={() => setOpenCompetency(!openCompetency)}>
                <DialogSelect
                  label={!isComptentecyEdit ? "Add Level" : "Edit Level"}
                  data={editCompetencyData}
                  backHome={setOpenCompetency}
                  getCompetency={addCompetency}
                />
              </Button>
            </div>

            <hr style={{ width: "80%" }} />
          </div>

          <div style={{ display: "flex", width: "100%" }}>
            <CustomCard customCss={"align-items:flex-start; padding:10px; gap:5px; width:100%; align-items:flex-start"}>
              <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "10px" }}>
                {commonJob.competency.map((competency, i) => {
                  return (
                    <CustomCard
                      width="300px"
                      customCss={"align-items:flex-start; padding:10px; gap:5px; justify-content:space-between"}
                      boxShadow=" 0 0 5px #aaa"
                      borderRadius="5px"
                      background={theme.colors.gray.light}
                      key={i}
                    >
                      <CustomCard
                        width="100%"
                        borderRadius="5px"
                        customCss={"flex-direction:row; justify-content:space-between"}
                        hoverStyles=""
                      >
                        <MdDelete
                          cursor={"pointer"}
                          color="red"
                          fontSize={20}
                          onClick={() => removeEnvironment("competency", competency)}
                        />
                        <div
                          style={{}}
                          onClick={() => {
                            editCompetency(competency.id)
                            setClickedComptency(i)
                          }}
                        >
                          {/* <RiEdit2Fill  cursor={'pointer'} /> */}
                          {i === clickedComptency ? <IoIosDoneAll /> : <RiEdit2Fill cursor={"pointer"} />}
                        </div>
                      </CustomCard>
                      <CustomCard background="none" customCss={"flex-direction:row"}>
                        <Text color={`${theme.colors.secondary.main}`} fontSize={"xs"}>
                          Job Level:{" "}
                        </Text>
                        <Text color="black">{competency.jobLevel.name}</Text>
                      </CustomCard>
                      <CustomCard background="none" customCss={"flex-direction:row"}>
                        <Text color={`${theme.colors.secondary.main}`}>Education: </Text>
                        <Text color="black">{competency.education.name}</Text>
                      </CustomCard>
                      <Text color={`${theme.colors.secondary.main}`}>Field of study</Text>
                      <CustomCard background="none" customCss={"flex-direction:row; gap:5px "}>
                        {competency.fieldOfStudies.map((study, index) => (
                          <Button customStyle={"border-radius:2px"} padding="2px" hoverBackground="none" key={index}>
                            <Text color="white" fontSize={"xs"}>
                              {study}
                            </Text>{" "}
                          </Button>
                        ))}
                      </CustomCard>

                      <Text color={`${theme.colors.secondary.main}`}>Skill:</Text>
                      <CustomCard
                        width="100%"
                        padding="10px"
                        background="none"
                        customCss={"flex-direction:row; gap:5px; overflow:scroll"}
                      >
                        {competency.skill.map((skill, index) => (
                          <Button customStyle={"border-radius:2px"} padding="2px" hoverBackground="none" key={index}>
                            <Text color="white" fontSize={"xs"}>
                              {skill}
                            </Text>{" "}
                          </Button>
                        ))}
                      </CustomCard>
                      <Text color={`${theme.colors.secondary.main}`}>Attitude:</Text>
                      <CustomCard background="none" customCss={"flex-direction:row; gap:5px "}>
                        {competency.attitude.map((attitude, index) => (
                          <Button customStyle={"border-radius:2px"} padding="2px" hoverBackground="none" key={index}>
                            <Text color="white" fontSize={"xs"}>
                              {attitude}
                            </Text>{" "}
                          </Button>
                        ))}
                      </CustomCard>
                    </CustomCard>
                  )
                })}
              </div>
            </CustomCard>
          </div>
        </CustomCard>
      </div>
    </CustomCard>
  )
}

export default JobAdd
