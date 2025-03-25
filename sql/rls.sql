ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chats_insert_policy"
    ON public.chats
    FOR INSERT 
    TO public
    WITH CHECK ();