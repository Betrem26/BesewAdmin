import { useEffect, useState } from "react";
import CustomCard from "../../components/atoms/cards/CustomCard";
// import Input from "../../components/atoms/inputs/CustomInput";
import { Competency, Education, } from "./common-job.type";
import Button from "../../components/atoms/buttons/CustomButton";
import { DialogActions, Button as SubmitButton } from "@mui/material";
import Text from "../../components/atoms/texts/CustomText";
import theme from "../../themes/Theme";

;
import { BasicSelect } from "./components/DefaultSelect";
import { IoClose } from "react-icons/io5";
import { TextInput } from "./components/inputs";
import { IoIosArrowBack } from "react-icons/io";
interface AddCompetencyProps {
  getCompetency: (competency: Competency) => void;
  backHome: any;
  data?: Competency | null;
  handleClose: any
}

export const AddCompetency: React.FC<AddCompetencyProps> = ({
  getCompetency,
  backHome,
  data,
  handleClose
}) => {
  const [competency, setCompetency] = useState<Competency>({
    id: generateRandomId(),
    jobLevel: { id: 1, name: "" },
    education: { id: 1, name: "" },
    fieldOfStudies: [],
    skill: [],
    attitude: [],
  });
  const [arrays, setArrays] = useState({
    filedOfStudy: "",
    skill: "",
    attitude: "",
  });

  useEffect(() => {
    if (!data) {
      return
    }
    setCompetency(data)
  }, [])
  function generateRandomId() {
    let id = '';
    for (let i = 0; i < 10; i++) {
      id += Math.floor(Math.random() * 10);
    }
    return id;
  }

  const [jobLevel, setJobLevel] = useState("")

  const addEduction = (value: any) => {
    console.log(value);

    setCompetency((prev: any) => {
      return { ...prev, education: { id: 1, name: value?.target.value } };
    });
  };
  useEffect(() => {
    onInputChange()
  }, [jobLevel])

  const onInputChange = () => {

    setCompetency((prev) => {

      return { ...prev, jobLevel: { id: 1, name: jobLevel } };
    });
  };

  const arrayChange = (e: any) => {
    const { value, name } = e.target;
    setArrays((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const addArrays = (key: string, newValue: string) => {
    setArrays((prev) => {
      return { ...prev, [key]: "" };
    });
    setCompetency((prev: Competency) => {
      const trimmedValue = newValue.trim();

      if (trimmedValue) { // Check if the value is not empty
        const uniqueValues = new Set(prev[key]);

        if (!uniqueValues.has(trimmedValue)) { // Check if the value doesn't already exist
          uniqueValues.add(trimmedValue);

          return { ...prev, [key]: [...uniqueValues] };

        } else {


          alert("Value already exists in the array.");
        }

      } else {
        console.error("newValue is empty or missing.");
      }

      return prev;
    });
  };


  const removeFromArray = (key: keyof Competency, valueToRemove: string) => {
    setCompetency((prevData) => ({
      ...prevData,
      [key]: (prevData[key] as string[]).filter(
        (value) => value !== valueToRemove
      ),
    }));
  };

  const onSubmit = () => {
    console.log("in here");
    getCompetency(competency);
    backHome(true)
  };



  return (
    <CustomCard customCss={'gap:10px; padding-top:10px'} borderRadius="10px">
      <div style={{ width: "100%", display: "flex", alignItems: "flex-start" }}>
        <div style={{ background: "gray", color: "white", padding: "10px", borderRadius: "50%", cursor: "pointer" }}>
          <IoIosArrowBack fontSize={20} onClick={() => backHome} />

        </div>

      </div>      <CustomCard customCss={'gap:10px; padding-top:10px; justify-content:flex-start'}>
        <BasicSelect data={["Internship", "Junior", "Senior", "Expert", "Manager", "Director", "Chief"]} label="Job level" onChange={(e) => setJobLevel(e.target.value)} value={jobLevel}
        />

        <BasicSelect label="Education" data={Object.values(Education).map(value => {
          return value.toLowerCase()
        })} onChange={addEduction} value={competency.education.name} />
      </CustomCard>

      <CustomCard>
        <hr style={{ width: "100%" }} />
        {/* <Label label='Field of study' /> */}

        <CustomCard customCss={"flex-direction:row; padding:20px"}>

          <TextInput name="filedOfStudy" type="input" label="filed of study" onChange={arrayChange} value={arrays.filedOfStudy} />


          <Button
            background={`linear-gradient(145deg, ${theme.colors.primary.main}, ${theme.colors.primary.light})`}
            height="100%"
            hoverBackground={theme.colors.primary.main}
            onClick={() => addArrays("fieldOfStudies", arrays.filedOfStudy)}
          >
            <Text color={theme.colors.white.dark}>add</Text>{" "}
          </Button>
        </CustomCard>
        {/*  */}
        <CustomCard

          border={`${competency.fieldOfStudies?.length > 0 && "1px solid gray"}`}
          borderRadius="10px"

          width="300px"
          customCss={"flex-direction:row; gap:2px; flex-wrap:wrap;overflow-y:scroll; gap:5px; max-height:200px; "}
        >
          {competency.fieldOfStudies.map((field, i) => {
            return (
              <CustomCard key={i} borderRadius="20px" background={theme.colors.gray.medium} customCss={'flex-direction:row; gap:4px; padding:8px 8px;'} padding="3px">
                <Text fontSize={"xs"} color="white" lineHeight="0">
                  {field}
                </Text>
                <Button

                  background="none"
                  padding="0"
                  onClick={() => removeFromArray("fieldOfStudies", field)}
                >

                  <Text fontSize={"md"} color="black">
                    <IoClose />

                  </Text>
                </Button>
              </CustomCard>
            );
          })}
        </CustomCard>
      </CustomCard>
      <CustomCard>
        {/* <Label label='Skill' /> */}
        <CustomCard customCss={"flex-direction:row"}>
          <TextInput name="skill" type="input" label="skill" onChange={arrayChange} value={arrays.skill} />

          <Button background={`linear-gradient(145deg, ${theme.colors.primary.main}, ${theme.colors.primary.light})`}
            height="100%"
            hoverBackground={theme.colors.primary.main}
            onClick={() => addArrays("skill", arrays.skill)}

          >
            {" "}
            <Text color={theme.colors.white.dark}>add</Text>
          </Button>
        </CustomCard>
        {/*  */}
        <CustomCard

          border={`${competency.skill?.length > 0 && "1px solid gray"}`}
          borderRadius="10px"

          width="300px"
          customCss={"flex-direction:row; gap:2px; flex-wrap:wrap;overflow-y:scroll; gap:5px; max-height:200px; "}
        >
          {competency.skill.map((field, i) => {
            return (
              <CustomCard key={i} borderRadius="20px" background={theme.colors.gray.medium} customCss={'flex-direction:row; gap:4px; padding:8px 8px;'} padding="3px">
                <Text fontSize={"xs"} color="white" lineHeight="0">
                  {field}
                </Text>
                <Button

                  background="none"
                  padding="0"
                  onClick={() => removeFromArray("skill", field)}
                >

                  <Text fontSize={"md"} color="black">
                    <IoClose />

                  </Text>
                </Button>
              </CustomCard>
            );
          })}
        </CustomCard>
      </CustomCard>
      <CustomCard>
        {/* <Label label='Attitude' /> */}

        {/*  */}
        <CustomCard customCss={"flex-direction:row"}>

          <TextInput name="attitude" type="input" label="attitude" onChange={arrayChange} value={arrays.attitude} />

          <Button
            background={`linear-gradient(145deg, ${theme.colors.primary.main}, ${theme.colors.primary.light})`}
            height="100%"
            hoverBackground={theme.colors.primary.main}
            onClick={() => addArrays("attitude", arrays.attitude)}
          >
            <Text color={theme.colors.white.dark}>add</Text>
          </Button>
        </CustomCard>

        <CustomCard

          border={`${competency.attitude?.length > 0 && "1px solid gray"}`}
          borderRadius="10px"

          width="300px"
          customCss={"flex-direction:row; gap:2px; flex-wrap:wrap;overflow-y:scroll; gap:5px; max-height:200px; "}
        >
          {competency.attitude.map((field, i) => {
            return (
              <CustomCard key={i} borderRadius="20px" background={theme.colors.gray.medium} customCss={'flex-direction:row; gap:4px; padding:8px 8px;'} padding="3px">
                <Text fontSize={"xs"} color="white" lineHeight="0">
                  {field}
                </Text>
                <Button

                  background="none"
                  padding="0"
                  onClick={() => removeFromArray("attitude", field)}
                >

                  <Text fontSize={"md"} color="black">
                    <IoClose />

                  </Text>
                </Button>
              </CustomCard>
            );
          })}
        </CustomCard>
      </CustomCard>
      <DialogActions>
        <SubmitButton sx={{ padding: "10px 26px", borderWidth: "2px", fontWeight: "bold" }} onClick={onSubmit} variant="outlined">{!data ? "Add" : 'Save'}</SubmitButton>
        <SubmitButton sx={{display:`${data ? "none" : 'block'}`, padding: "10px 26px", borderWidth: "2px", fontWeight: "bold" }} onClick={handleClose} variant="outlined">Cancel</SubmitButton>
      </DialogActions>

    </CustomCard>
  );
};
