/*
  # Create poker platform database schema

  1. New Tables
    - `poker_tables`
      - `id` (uuid, primary key)
      - `name` (text)
      - `game_type` (enum: holdem, omaha4, omaha6)
      - `stakes_small` (integer)
      - `stakes_big` (integer)
      - `max_players` (integer)
      - `current_players` (integer)
      - `status` (enum: waiting, playing, finished)
      - `pot` (integer)
      - `community_cards` (text array)
      - `current_turn` (integer)
      - `dealer_position` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid)

    - `table_players`
      - `id` (uuid, primary key)
      - `table_id` (uuid, foreign key)
      - `user_id` (uuid)
      - `username` (text)
      - `chips` (integer)
      - `position` (integer)
      - `cards` (text array)
      - `status` (enum: waiting, playing, folded, all_in)
      - `current_bet` (integer)
      - `total_bet` (integer)
      - `joined_at` (timestamp)

    - `game_actions`
      - `id` (uuid, primary key)
      - `table_id` (uuid, foreign key)
      - `user_id` (uuid)
      - `action_type` (enum: fold, check, call, raise, all_in)
      - `amount` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
    - Add policies for real-time subscriptions
*/

-- Create custom types
CREATE TYPE game_type AS ENUM ('holdem', 'omaha4', 'omaha6');
CREATE TYPE table_status AS ENUM ('waiting', 'playing', 'finished');
CREATE TYPE player_status AS ENUM ('waiting', 'playing', 'folded', 'all_in');
CREATE TYPE action_type AS ENUM ('fold', 'check', 'call', 'raise', 'all_in');

-- Create poker_tables table
CREATE TABLE IF NOT EXISTS poker_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  game_type game_type NOT NULL DEFAULT 'holdem',
  stakes_small integer NOT NULL DEFAULT 2,
  stakes_big integer NOT NULL DEFAULT 5,
  max_players integer NOT NULL DEFAULT 6,
  current_players integer DEFAULT 0,
  status table_status DEFAULT 'waiting',
  pot integer DEFAULT 0,
  community_cards text[] DEFAULT '{}',
  current_turn integer DEFAULT 0,
  dealer_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid NOT NULL
);

-- Create table_players table
CREATE TABLE IF NOT EXISTS table_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id uuid REFERENCES poker_tables(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  username text NOT NULL,
  chips integer DEFAULT 1000,
  position integer NOT NULL,
  cards text[] DEFAULT '{}',
  status player_status DEFAULT 'waiting',
  current_bet integer DEFAULT 0,
  total_bet integer DEFAULT 0,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(table_id, position),
  UNIQUE(table_id, user_id)
);

-- Create game_actions table
CREATE TABLE IF NOT EXISTS game_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id uuid REFERENCES poker_tables(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  action_type action_type NOT NULL,
  amount integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE poker_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_actions ENABLE ROW LEVEL SECURITY;

-- Create policies for poker_tables
CREATE POLICY "Anyone can view poker tables"
  ON poker_tables
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create tables"
  ON poker_tables
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Table creators can update their tables"
  ON poker_tables
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create policies for table_players
CREATE POLICY "Anyone can view table players"
  ON table_players
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can join tables"
  ON table_players
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Players can update their own data"
  ON table_players
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Players can leave tables"
  ON table_players
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for game_actions
CREATE POLICY "Anyone can view game actions"
  ON game_actions
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create actions"
  ON game_actions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_poker_tables_game_type ON poker_tables(game_type);
CREATE INDEX IF NOT EXISTS idx_poker_tables_status ON poker_tables(status);
CREATE INDEX IF NOT EXISTS idx_poker_tables_created_at ON poker_tables(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_table_players_table_id ON table_players(table_id);
CREATE INDEX IF NOT EXISTS idx_table_players_user_id ON table_players(user_id);
CREATE INDEX IF NOT EXISTS idx_game_actions_table_id ON game_actions(table_id);
CREATE INDEX IF NOT EXISTS idx_game_actions_created_at ON game_actions(created_at DESC);

-- Create function to update table player count
CREATE OR REPLACE FUNCTION update_table_player_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE poker_tables 
    SET current_players = current_players + 1,
        updated_at = now()
    WHERE id = NEW.table_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE poker_tables 
    SET current_players = current_players - 1,
        updated_at = now()
    WHERE id = OLD.table_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update player counts
DROP TRIGGER IF EXISTS trigger_update_player_count_insert ON table_players;
CREATE TRIGGER trigger_update_player_count_insert
  AFTER INSERT ON table_players
  FOR EACH ROW EXECUTE FUNCTION update_table_player_count();

DROP TRIGGER IF EXISTS trigger_update_player_count_delete ON table_players;
CREATE TRIGGER trigger_update_player_count_delete
  AFTER DELETE ON table_players
  FOR EACH ROW EXECUTE FUNCTION update_table_player_count();

-- Insert sample data for testing
INSERT INTO poker_tables (name, game_type, stakes_small, stakes_big, max_players, created_by) VALUES
('Холдем Ширээ #1', 'holdem', 2, 5, 6, gen_random_uuid()),
('4 Картын Омаха #1', 'omaha4', 5, 10, 6, gen_random_uuid()),
('6 Картын Омаха #1', 'omaha6', 10, 20, 6, gen_random_uuid()),
('Хурдны Холдем', 'holdem', 1, 2, 9, gen_random_uuid()),
('VIP Омаха Ширээ', 'omaha4', 25, 50, 4, gen_random_uuid());