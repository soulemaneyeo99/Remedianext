import Link from 'next/link'
import { Leaf, Mail, Github, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">REMÉDIA</span>
            </div>
            <p className="text-gray-400 text-sm">
              L'intelligence artificielle au service de la médecine traditionnelle africaine.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
              <li><Link href="/scan" className="hover:text-white transition-colors">Scanner</Link></li>
              <li><Link href="/chat" className="hover:text-white transition-colors">Assistant IA</Link></li>
              <li><Link href="/plants" className="hover:text-white transition-colors">Encyclopédie</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Ressources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">À propos</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Suivez-nous</h4>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-4">
              <a href="mailto:contact@remedia.africa" className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors">
                <Mail className="h-4 w-4" />
                <span>contact@remedia.africa</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© 2025 REMÉDIA. Tous droits réservés.</p>
          <p>Fait avec ❤️ pour l'Afrique | Powered by Gemini AI</p>
        </div>
      </div>
    </footer>
  )
}
