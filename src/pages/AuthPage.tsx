import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';
import { Spade, Heart, Diamond, Club } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { dispatch } = useAppContext();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const user = session.user;
        dispatch({
          type: 'LOGIN',
          payload: {
            id: user.id,
            username: user.email?.split('@')[0] || 'Тоглогч',
            balance: 10000,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
            level: 1,
            isAdmin: false,
          }
        });
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex space-x-1">
              <Spade className="w-8 h-8 text-accent" />
              <Heart className="w-8 h-8 text-red-500" />
              <Diamond className="w-8 h-8 text-red-500" />
              <Club className="w-8 h-8 text-accent" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ZENITH</h1>
          <h2 className="text-2xl font-bold text-accent mb-4">Poker</h2>
          <p className="text-gray-400">Монголын шилдэг покер платформ</p>
        </div>

        {/* Auth Component */}
        <div className="bg-secondary/80 backdrop-blur rounded-2xl p-6 border border-gray-700/50">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#00d4aa',
                    brandAccent: '#00bfff',
                    brandButtonText: 'white',
                    defaultButtonBackground: '#374151',
                    defaultButtonBackgroundHover: '#4b5563',
                    inputBackground: '#374151',
                    inputBorder: '#6b7280',
                    inputBorderHover: '#00d4aa',
                    inputBorderFocus: '#00d4aa',
                  },
                  space: {
                    spaceSmall: '4px',
                    spaceMedium: '8px',
                    spaceLarge: '16px',
                    labelBottomMargin: '8px',
                    anchorBottomMargin: '4px',
                    emailInputSpacing: '4px',
                    socialAuthSpacing: '4px',
                    buttonPadding: '10px 15px',
                    inputPadding: '10px 15px',
                  },
                  fontSizes: {
                    baseBodySize: '14px',
                    baseInputSize: '14px',
                    baseLabelSize: '14px',
                    baseButtonSize: '14px',
                  },
                  fonts: {
                    bodyFontFamily: `'Inter', ui-sans-serif, sans-serif`,
                    buttonFontFamily: `'Inter', ui-sans-serif, sans-serif`,
                    inputFontFamily: `'Inter', ui-sans-serif, sans-serif`,
                    labelFontFamily: `'Inter', ui-sans-serif, sans-serif`,
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '8px',
                    buttonBorderRadius: '8px',
                    inputBorderRadius: '8px',
                  },
                }
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
                label: 'auth-label',
              }
            }}
            localization={{
              variables: {
                sign_up: {
                  email_label: 'И-мэйл хаяг',
                  password_label: 'Нууц үг',
                  email_input_placeholder: 'Таны и-мэйл хаяг',
                  password_input_placeholder: 'Таны нууц үг',
                  button_label: 'Бүртгүүлэх',
                  loading_button_label: 'Бүртгүүлж байна...',
                  social_provider_text: '{{provider}}-ээр нэвтрэх',
                  link_text: 'Шинэ хэрэглэгч үү? Бүртгүүлэх',
                  confirmation_text: 'И-мэйл хаягаа шалгана уу'
                },
                sign_in: {
                  email_label: 'И-мэйл хаяг',
                  password_label: 'Нууц үг',
                  email_input_placeholder: 'Таны и-мэйл хаяг',
                  password_input_placeholder: 'Таны нууц үг',
                  button_label: 'Нэвтрэх',
                  loading_button_label: 'Нэвтэрч байна...',
                  social_provider_text: '{{provider}}-ээр нэвтрэх',
                  link_text: 'Хэрэглэгч байгаа юу? Нэвтрэх'
                },
                magic_link: {
                  email_input_label: 'И-мэйл хаяг',
                  email_input_placeholder: 'Таны и-мэйл хаяг',
                  button_label: 'Шидэт холбоос илгээх',
                  loading_button_label: 'Илгээж байна...',
                  link_text: 'Шидэт холбоосоор нэвтрэх',
                  confirmation_text: 'И-мэйл хаягаа шалгана уу'
                },
                forgotten_password: {
                  email_label: 'И-мэйл хаяг',
                  password_label: 'Таны и-мэйл хаяг',
                  email_input_placeholder: 'Таны и-мэйл хаяг',
                  button_label: 'Нууц үг сэргээх заавар илгээх',
                  loading_button_label: 'Илгээж байна...',
                  link_text: 'Нууц үгээ мартсан уу?',
                  confirmation_text: 'И-мэйл хаягаа шалгана уу'
                }
              }
            }}
            providers={[]}
            redirectTo={window.location.origin}
          />
        </div>

        {/* Features */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Олон тоглогчтой</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Бодит цагийн тоглоом</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Аюулгүй платформ</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Омаха & Холдем</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;