// import { useSelector } from 'react-redux'
// import CustomCard from '../../components/atoms/cards/CustomCard'
// import { RootState } from '../../store/store'
// import { useState } from 'react'

// interface AddJobFormProps {
//     onAdd: (job: any) => void;
// }

// function AddJobForm({ onAdd }: AddJobFormProps) {
//     const userData = useSelector((store: RootState) => store.user)
//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [company, setCompany] = useState("");

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!title || !company) return;
//         onAdd({
//             id: Date.now(),
//             title,
//             company,
//             description,
//             addedByAdmin: true,
//             party_id: userData?.user.account_id,
//         });
//         setTitle("");
//         setCompany("");
//         setDescription("");
//     };

//     return (
//         <CustomCard width='100%' height='100%' background='white'>
//             <form onSubmit={handleSubmit} style={{ padding: 20 }}>
//                 <input
//                     value={title}
//                     onChange={e => setTitle(e.target.value)}
//                     placeholder="Job Title"
//                     required
//                 /><br />
//                 <input
//                     value={company}
//                     onChange={e => setCompany(e.target.value)}
//                     placeholder="Company"
//                     required
//                 /><br />
//                 <textarea
//                     value={description}
//                     onChange={e => setDescription(e.target.value)}
//                     placeholder="Description"
//                 /><br />
//                 <button type="submit">Add Job</button>
//             </form>
//         </CustomCard>
//     )
// }

// export default AddJobForm