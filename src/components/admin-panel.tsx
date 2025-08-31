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
  Shield,
  Copy,
  CheckCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db, auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin?: any;
  createdAt: any;
}

interface AdminPanelProps {
  onClose: () => void;
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const { showToast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchTeamMembers = async () => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const members = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
    setTeamMembers(members);
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const addTeamMember = async (memberData: Omit<TeamMember, 'id' | 'createdAt'> & { password?: string }) => {
    try {
      if (!memberData.password) {
        showToast('Password is required', 'error');
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, memberData.email, memberData.password);
      const user = userCredential.user;

      const newMember = {
        name: memberData.name,
        email: memberData.email,
        role: memberData.role,
        status: memberData.status,
        createdAt: serverTimestamp(),
        lastLogin: null
      };

      await setDoc(doc(db, 'users', user.uid), newMember);
      fetchTeamMembers();
      setIsAddingMember(false);
      showToast('Team member added successfully', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    try {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, updates);
      fetchTeamMembers();
      setEditingMember(null);
      showToast('Team member updated successfully', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      const userRef = doc(db, 'users', id);
      await deleteDoc(userRef);
      // Note: This does not delete the user from Firebase Auth to prevent re-registration issues.
      // You might want to disable the user instead.
      fetchTeamMembers();
      showToast('Team member deleted successfully', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };
  
  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      showToast('Failed to copy', 'error');
    }
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

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>User ID</TableHead>
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
                           <span className="font-mono text-xs">{member.id}</span>
                           <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(member.id, member.id)}
                          >
                            {copiedId === member.id ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AddMemberForm({ onSubmit }: { onSubmit: (member: Omit<TeamMember, 'id' | 'createdAt'> & { password?: string }) => void }) {
  const { showToast } = useToast();
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
      showToast('Please fill in all fields', 'error');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full Name" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@company.com" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Enter password" />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select value={formData.role} onValueChange={(value: 'admin' | 'user') => setFormData({ ...formData, role: value })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2"><Button type="submit" className="flex-1">Add Member</Button></div>
    </form>
  );
}

function EditMemberForm({ member, onSubmit, onCancel }: { member: TeamMember; onSubmit: (updates: Partial<TeamMember>) => void;onCancel: () => void;}) {
  const [formData, setFormData] = useState({
    name: member.name,
    email: member.email,
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
        <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}/>
      </div>
      <div>
        <Label htmlFor="edit-email">Email</Label>
        <Input id="edit-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
      </div>
      <div>
        <Label htmlFor="edit-role">Role</Label>
        <Select value={formData.role} onValueChange={(value: 'admin' | 'user') => setFormData({ ...formData, role: value })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="edit-status">Status</Label>
        <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2"><Button type="submit" className="flex-1">Update Member</Button><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button></div>
    </form>
  );
}
