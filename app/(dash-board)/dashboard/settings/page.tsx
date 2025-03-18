import { getCurrentUser } from '@/lib/session';
import SettingsLayout from '@/components/back-end/settings/settings-layout';

import React from 'react';

export default async function page() {
  const user = await getCurrentUser();

  return (
    <div>
      <SettingsLayout user={user} />
    </div>
  );
}
