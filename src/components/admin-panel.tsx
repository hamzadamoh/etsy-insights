'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Shield, 
  Key,
  Copy,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

interface AdminPanelProps {
  onClose: () => void;
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initialize with default admin and some sample users
  useEffect(() => {
    const savedMembers = localStorage.getItem('etsy-insights-team');
    if (savedMembers) {
      setTeamMembers(JSON.parse(savedMembers));
    } else {
      const defaultMembers: TeamMember[] = [
        {
          id: 'admin-001',
          name: 'Admin User',
          email: 'admin@etsyinsights.com',
          password: 'admin123',
          role: 'admin',
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'user-001',
          name: 'John Doe',
          email: 'john@company.com',
          password: 'team2024',
          role: 'user',
          status: 'active',
          createdAt: new Date().toISOString(),
        }
      ];
      setTeamMembers(defaultMembers);
      localStorage.setItem('etsy-insights-team', JSON.stringify(defaultMembers));
    }
  }, []);

  const saveTeamMembers = (members: TeamMember[]) => {
    setTeamMembers(members);
    localStorage.setItem('etsy-insights-team', JSON.stringify(members));
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const addTeamMember = (memberData: Omit<TeamMember, 'id' | 'createdAt'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updatedMembers = [...teamMembers, newMember];
    saveTeamMembers(updatedMembers);
    setIsAddingMember(false);
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    const updatedMembers = teamMembers.map(member =>
      member.id === id ? { ...member, ...updates } : member
    );
    saveTeamMembers(updatedMembers);
    setEditingMember(null);
  };

  const deleteTeamMember = (id: string) => {
    if (teamMembers.find(m => m.id === id)?.role === 'admin') {
      alert('Cannot delete admin users');
      return;
    }
    const updatedMembers = teamMembers.filter(member => member.id !== id);
    saveTeamMembers(updatedMembers);
  };

  const copyPassword = async (password: string, id: string) => {
    try {
      await navigator.clipboard.writeText(password);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      alert('Failed to copy password');
    }
  };

  const resetPassword = (id: string) => {
    const newPassword = generatePassword();
    updateTeamMember(id, { password: newPassword });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container mx-auto p-4 max-w-6xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Admin Panel</CardTitle>
                  <p className="text-muted-foreground">Manage team members and access</p>
                </div>
              </div>
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Add New Member */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Team Member</DialogTitle>
                  </DialogHeader>
                  <AddMemberForm onSubmit={addTeamMember} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Team Members Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.status === 'active' ? 'default' : 'destructive'}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">
                            {showPasswords ? member.password : '••••••••'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPasswords(!showPasswords)}
                          >
                            {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyPassword(member.password, member.id)}
                          >
                            {copiedId === member.id ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {member.lastLogin ? new Date(member.lastLogin).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingMember(member)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Team Member</DialogTitle>
                              </DialogHeader>
                              <EditMemberForm 
                                member={member} 
                                onSubmit={(updates) => updateTeamMember(member.id, updates)}
                                onCancel={() => setEditingMember(null)}
                              />
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => resetPassword(member.id)}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                          
                          {member.role !== 'admin' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTeamMember(member.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Admin Actions */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Admin Actions</h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? 'Hide' : 'Show'} Passwords
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const updatedMembers = teamMembers.map(member => ({
                      ...member,
                      password: generatePassword()
                    }));
                    saveTeamMembers(updatedMembers);
                    alert('All passwords have been reset!');
                  }}
                >
                  Reset All Passwords
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const data = teamMembers.map(m => ({
                      name: m.name,
                      email: m.email,
                      password: m.password,
                      role: m.role
                    }));
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'team-members.json';
                    a.click();
                  }}
                >
                  Export Team Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Add Member Form Component
function AddMemberForm({ onSubmit }: { onSubmit: (member: Omit<TeamMember, 'id' | 'createdAt'>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as const,
    status: 'active' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      alert('Please fill in all fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Full Name"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@company.com"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Enter password"
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select value={formData.role} onValueChange={(value: 'admin' | 'user') => setFormData({ ...formData, role: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">Add Member</Button>
        <Button type="button" variant="outline" onClick={() => setFormData({ ...formData, password: generatePassword() })}>
          Generate Password
        </Button>
      </div>
    </form>
  );
}

// Edit Member Form Component
function EditMemberForm({ 
  member, 
  onSubmit, 
  onCancel 
}: { 
  member: TeamMember; 
  onSubmit: (updates: Partial<TeamMember>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: member.name,
    email: member.email,
    password: member.password,
    role: member.role,
    status: member.status,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-name">Name</Label>
        <Input
          id="edit-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="edit-email">Email</Label>
        <Input
          id="edit-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="edit-password">Password</Label>
        <Input
          id="edit-password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="edit-role">Role</Label>
        <Select value={formData.role} onValueChange={(value: 'admin' | 'user') => setFormData({ ...formData, role: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="edit-status">Status</Label>
        <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">Update Member</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

// Helper function for generating passwords
function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
