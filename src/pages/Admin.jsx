import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../base44';

export default function Admin() {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editOwner, setEditOwner] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const triggerLASearch = () => {
    window.alert("COMMAND RECEIVED: Pulling 10 Just-Listed LA Properties >$2M...");
  };
const [confirmDelete, setConfirmDelete] = useState(null);
  const [editOwner, setEditOwner] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const triggerLASearch = () => {
    window.alert("COMMAND RECEIVED: Pulling 10 Just-Listed LA Properties >$2M...");
  };