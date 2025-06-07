import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './Representatives.css'

interface Representative {
  id: string
  name: string
  type: 'MLA' | 'MLC' | 'MP'
  party: string
  email: string
  phone: string
  status: string
  constituency_id?: string
  constituency?: {
    name: string
    state: string
  }
}

interface Constituency {
  id: string
  name: string
  state: string
  type: string
}

const Representatives: React.FC = () => {
  const [representatives, setRepresentatives] = useState<Representative[]>([])
  const [constituencies, setConstituencies] = useState<Constituency[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingRep, setEditingRep] = useState<Representative | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'MLA' as 'MLA' | 'MLC' | 'MP',
    party: '',
    email: '',
    phone: '',
    constituency_id: '',
    status: 'active'
  })

  useEffect(() => {
    fetchRepresentatives()
    fetchConstituencies()
  }, [])

  const fetchRepresentatives = async () => {
    try {
      const { data, error } = await supabase
        .from('representatives')
        .select(`
          id,
          name,
          type,
          party,
          email,
          phone,
          status,
          constituency_id,
          constituencies (
            name,
            state
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRepresentatives(data || [])
    } catch (error) {
      console.error('Error fetching representatives:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchConstituencies = async () => {
    try {
      const { data, error } = await supabase
        .from('constituencies')
        .select('id, name, state, type')
        .order('name')

      if (error) throw error
      setConstituencies(data || [])
    } catch (error) {
      console.error('Error fetching constituencies:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingRep) {
        const { error } = await supabase
          .from('representatives')
          .update(formData)
          .eq('id', editingRep.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('representatives')
          .insert([formData])
        
        if (error) throw error
      }

      setShowForm(false)
      setEditingRep(null)
      resetForm()
      fetchRepresentatives()
    } catch (error) {
      console.error('Error saving representative:', error)
      alert('Error saving representative. Please try again.')
    }
  }

  const handleEdit = (rep: Representative) => {
    setEditingRep(rep)
    setFormData({
      name: rep.name,
      type: rep.type,
      party: rep.party,
      email: rep.email,
      phone: rep.phone,
      constituency_id: rep.constituency_id || '',
      status: rep.status
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this representative?')) return

    try {
      const { error } = await supabase
        .from('representatives')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchRepresentatives()
    } catch (error) {
      console.error('Error deleting representative:', error)
      alert('Error deleting representative. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'MLA',
      party: '',
      email: '',
      phone: '',
      constituency_id: '',
      status: 'active'
    })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingRep(null)
    resetForm()
  }

  if (loading) {
    return <div className="loading">Loading representatives...</div>
  }

  return (
    <div className="representatives-page">
      <div className="page-header">
        <h1>Representatives Management</h1>
        <button 
          className="add-btn"
          onClick={() => setShowForm(true)}
        >
          + Add Representative
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingRep ? 'Edit Representative' : 'Add New Representative'}</h2>
              <button className="close-btn" onClick={handleCancel}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="rep-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="type">Type *</label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as 'MLA' | 'MLC' | 'MP'})}
                    required
                  >
                    <option value="MLA">MLA</option>
                    <option value="MLC">MLC</option>
                    <option value="MP">MP</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="party">Party</label>
                  <input
                    id="party"
                    type="text"
                    value={formData.party}
                    onChange={(e) => setFormData({...formData, party: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="constituency">Constituency</label>
                  <select
                    id="constituency"
                    value={formData.constituency_id}
                    onChange={(e) => setFormData({...formData, constituency_id: e.target.value})}
                  >
                    <option value="">Select Constituency</option>
                    {constituencies.map((constituency) => (
                      <option key={constituency.id} value={constituency.id}>
                        {constituency.name} ({constituency.state})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingRep ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="representatives-grid">
        {representatives.length === 0 ? (
          <div className="no-data">
            <p>No representatives found. Add your first representative!</p>
          </div>
        ) : (
          representatives.map((rep) => (
            <div key={rep.id} className="rep-card">
              <div className="rep-header">
                <h3>{rep.name}</h3>
                <span className={`type-badge ${rep.type.toLowerCase()}`}>
                  {rep.type}
                </span>
              </div>
              
              <div className="rep-details">
                <p><strong>Party:</strong> {rep.party || 'N/A'}</p>
                <p><strong>Constituency:</strong> {rep.constituency?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {rep.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {rep.phone || 'N/A'}</p>
                <p><strong>Status:</strong> 
                  <span className={`status-badge ${rep.status}`}>
                    {rep.status}
                  </span>
                </p>
              </div>
              
              <div className="rep-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(rep)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(rep.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Representatives