-- Create admin user via auth.users
-- Note: This uses the Supabase admin API approach via a helper function
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Check if user already exists
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'yanpiccolo@gmail.com';
  
  IF v_user_id IS NULL THEN
    -- Create user in auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'yanpiccolo@gmail.com',
      crypt('FlowAdmin2026', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"display_name": "Admin FlowBooking"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO v_user_id;

    -- Create identity for the user
    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      v_user_id,
      'yanpiccolo@gmail.com',
      jsonb_build_object('sub', v_user_id::text, 'email', 'yanpiccolo@gmail.com'),
      'email',
      now(),
      now(),
      now()
    );
  END IF;

  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Create profile
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (v_user_id, 'Admin FlowBooking')
  ON CONFLICT (user_id) DO NOTHING;
END $$;