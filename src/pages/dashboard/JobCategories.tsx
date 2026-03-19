import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchAdminCategories, fetchCategoriesByLang, fetchCategoriesByType, createCategory, deleteCategory, clearError } from '../../store/features/jobCategoriesSlice';
import { toast } from 'react-toastify';

const JobCategories: React.FC = () => {
  const dispatch = useAppDispatch();
  const { adminCategories, loading, error } = useAppSelector((state) => state.jobCategories);
  const [showForm, setShowForm] = useState(false);
  const [langFilter, setLangFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    companyType: 'company' as 'company' | 'local_agency' | 'Int_agency' | 'bpo' | 'broker',
    langOpt: 'English' as 'English' | 'Amharic' | 'Oromiffa',
    icon: null as File | null 
  });

  useEffect(() => {
    if (langFilter !== 'all') {
      dispatch(fetchCategoriesByLang(langFilter));
    } else if (typeFilter !== 'all') {
      dispatch(fetchCategoriesByType(typeFilter));
    } else {
      dispatch(fetchAdminCategories());
    }
  }, [dispatch, langFilter, typeFilter]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(createCategory({
      name: formData.name,
      description: formData.description,
      companyType: formData.companyType,
      langOpt: formData.langOpt,
      icon: formData.icon || undefined
    }));
    toast.success('Category created');
    setShowForm(false);
    setFormData({ name: '', description: '', companyType: 'company', langOpt: 'English', icon: null });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this category?')) {
      await dispatch(deleteCategory(id));
      toast.success('Category deleted');
    }
  };

  return (
    <Container>
      <Header>
        <Title>Job Categories</Title>
        <Filters>
          <Select value={langFilter} onChange={(e) => { setLangFilter(e.target.value); setTypeFilter('all'); }}>
            <option value="all">All Languages</option>
            <option value="English">English</option>
            <option value="Amharic">Amharic</option>
            <option value="Oromiffa">Oromiffa</option>
          </Select>
          <Select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setLangFilter('all'); }}>
            <option value="all">All Types</option>
            <option value="company">Company</option>
            <option value="local_agency">Local Agency</option>
            <option value="Int_agency">Int. Agency</option>
            <option value="bpo">BPO</option>
            <option value="broker">Broker</option>
          </Select>
          <Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'Add Category'}</Button>
        </Filters>
      </Header>
      {showForm && (
        <Form onSubmit={handleSubmit}>
          <Input placeholder="Category Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <Input placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
          <Input type="file" accept="image/*" onChange={(e) => setFormData({...formData, icon: e.target.files?.[0] || null})} />
          <Button type="submit">Create Category</Button>
        </Form>
      )}
      {loading && <LoadingText>Loading categories...</LoadingText>}
      {!loading && adminCategories.length === 0 && <EmptyState>No categories found</EmptyState>}
      {!loading && adminCategories.length > 0 && (
        <Grid>
          {adminCategories.map((category) => (
            <Card key={category._id}>
              {category.icon && <Icon src={category.icon} alt={category.name} />}
              <CardTitle>{category.name}</CardTitle>
              <CardDesc>{category.description}</CardDesc>
              <CardActions>
                <ActionButton onClick={() => handleDelete(category._id)}>Delete</ActionButton>
              </CardActions>
            </Card>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default JobCategories;

const Container = styled.div`padding: 24px;`;
const Header = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;`;
const Title = styled.h1`font-size: 28px; font-weight: 600; color: #1a202c;`;
const Filters = styled.div`display: flex; gap: 12px; align-items: center;`;
const Select = styled.select`padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px;`;
const Button = styled.button`padding: 10px 24px; background: #3182ce; color: white; border: none; border-radius: 6px; cursor: pointer; &:hover { background: #2c5282; }`;
const Form = styled.form`background: white; padding: 24px; border-radius: 8px; margin-bottom: 24px; display: flex; flex-direction: column; gap: 16px;`;
const Input = styled.input`padding: 10px 16px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px;`;
const LoadingText = styled.p`text-align: center; color: #718096; padding: 40px;`;
const EmptyState = styled.p`text-align: center; color: #718096; padding: 40px;`;
const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;`;
const Card = styled.div`background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);`;
const Icon = styled.img`width: 60px; height: 60px; object-fit: contain; margin-bottom: 12px;`;
const CardTitle = styled.h3`font-size: 18px; font-weight: 600; color: #2d3748; margin-bottom: 8px;`;
const CardDesc = styled.p`font-size: 14px; color: #718096; margin-bottom: 16px;`;
const CardActions = styled.div`display: flex; gap: 8px;`;
const ActionButton = styled.button`padding: 6px 12px; background: #e53e3e; color: white; border: none; border-radius: 4px; font-size: 13px; cursor: pointer; &:hover { background: #c53030; }`;
