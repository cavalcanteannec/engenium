import React, { useState } from 'react';
import { Calendar, Users, Scissors, Settings, LayoutDashboard, Clock, DollarSign, TrendingUp, Plus, Edit, Trash2, Search, X } from 'lucide-react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState({
    id: '1',
    barbershopName: 'Studio Beleza',
    logoUrl: null,
    primaryColor: '#272727ff',
    secondaryColor: '#003f0aff',
    darkMode: true,
    onboardingComplete: true
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Estados para CRUD
  const [categories, setCategories] = useState([
    { id: '1', name: 'Cabelo', description: 'Serviços de cabelo' },
    { id: '2', name: 'Unha', description: 'Manicure e pedicure' },
    { id: '3', name: 'Barba', description: 'Serviços de barbearia' }
  ]);

  const [services, setServices] = useState([
    { id: '1', name: 'Corte + Escova', categoryId: '1', price: 100, duration: 60, active: true },
    { id: '2', name: 'Escova Simples', categoryId: '1', price: 50, duration: 30, active: true },
    { id: '3', name: 'Manicure', categoryId: '2', price: 35, duration: 45, active: true },
    { id: '4', name: 'Barba Completa', categoryId: '3', price: 40, duration: 30, active: true }
  ]);

  const [employees, setEmployees] = useState([
    { id: '1', name: 'Ana Paula Silva', phone: '85999999999', email: 'ana@email.com', active: true, specialties: ['1', '2'] },
    { id: '2', name: 'Carlos Mendes', phone: '85988888888', email: 'carlos@email.com', active: true, specialties: ['4'] },
    { id: '3', name: 'Fernanda Lima', phone: '85977777777', email: 'fernanda@email.com', active: true, specialties: ['3'] }
  ]);

  // Login Page
  const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
      setIsAuthenticated(true);
      if (!user.onboardingComplete) {
        setShowOnboarding(true);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scissors className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">agenda pro</h1>
            <p className="text-gray-600 mt-2">sistema de agendamentos inteligente</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition"
            >
              entrar
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              continuar com google
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            não tem conta? <a href="#" className="text-purple-600 font-medium hover:underline">criar conta</a>
          </p>
        </div>
      </div>
    );
  };

  // Dashboard
  const Dashboard = () => {
    const stats = [
      { title: 'agendamentos hoje', value: '12', icon: Calendar, color: 'bg-blue-500' },
      { title: 'clientes atendidos', value: '145', icon: Users, color: 'bg-green-500' },
      { title: 'receita do mês', value: 'R$ 8.450', icon: DollarSign, color: 'bg-purple-500' },
      { title: 'taxa de ocupação', value: '78%', icon: TrendingUp, color: 'bg-pink-500' },
    ];

    const todayAppointments = [
      { time: '09:00', client: 'Maria Silva', service: 'Corte + Escova', employee: 'Ana Paula' },
      { time: '10:30', client: 'João Santos', service: 'Barba', employee: 'Carlos Mendes' },
      { time: '14:00', client: 'Paula Costa', service: 'Manicure', employee: 'Fernanda Lima' },
      { time: '15:30', client: 'Roberto Alves', service: 'Corte Masculino', employee: 'Carlos Mendes' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">dashboard</h1>
          <p className="text-gray-600 mt-1">bem-vinda de volta! aqui está o resumo de hoje</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">agendamentos de hoje</h2>
            <div className="space-y-3">
              {todayAppointments.map((apt, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-16 text-center">
                    <p className="text-sm font-semibold text-purple-600">{apt.time}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{apt.client}</p>
                    <p className="text-sm text-gray-600">{apt.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{apt.employee}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">resumo semanal</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">segunda</span>
                <span className="font-semibold">15 agendamentos</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">terça</span>
                <span className="font-semibold">18 agendamentos</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">quarta</span>
                <span className="font-semibold">12 agendamentos</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">quinta</span>
                <span className="font-semibold">20 agendamentos</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">sexta</span>
                <span className="font-semibold">22 agendamentos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Categories Page
  const CategoriesPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const handleSave = () => {
      if (editingCategory) {
        setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c));
      } else {
        setCategories([...categories, { id: Date.now().toString(), ...formData }]);
      }
      setShowModal(false);
      setFormData({ name: '', description: '' });
      setEditingCategory(null);
    };

    const handleEdit = (category) => {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description });
      setShowModal(true);
    };

    const handleDelete = (id) => {
      setCategories(categories.filter(c => c.id !== id));
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">categorias</h1>
            <p className="text-gray-600 mt-1">organize seus serviços por categoria</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ backgroundColor: user.primaryColor }}
            className="flex items-center gap-2 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            <Plus className="w-5 h-5" />
            nova categoria
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <div key={category.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {services.filter(s => s.categoryId === category.id).length} serviços
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCategory ? 'editar categoria' : 'nova categoria'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingCategory(null);
                    setFormData({ name: '', description: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">nome</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="ex: Cabelo, Unha, Barba..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="3"
                    placeholder="descrição da categoria..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingCategory(null);
                      setFormData({ name: '', description: '' });
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    style={{ backgroundColor: user.primaryColor }}
                    className="flex-1 text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition"
                  >
                    salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Services Page
  const ServicesPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [formData, setFormData] = useState({
      name: '',
      categoryId: '',
      price: '',
      duration: '',
      active: true
    });

    const filteredServices = services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || service.categoryId === filterCategory;
      return matchesSearch && matchesCategory;
    });

    const handleSave = () => {
      if (editingService) {
        setServices(services.map(s => s.id === editingService.id ? { ...s, ...formData } : s));
      } else {
        setServices([...services, { id: Date.now().toString(), ...formData }]);
      }
      setShowModal(false);
      setFormData({ name: '', categoryId: '', price: '', duration: '', active: true });
      setEditingService(null);
    };

    const handleEdit = (service) => {
      setEditingService(service);
      setFormData({
        name: service.name,
        categoryId: service.categoryId,
        price: service.price,
        duration: service.duration,
        active: service.active
      });
      setShowModal(true);
    };

    const handleDelete = (id) => {
      setServices(services.filter(s => s.id !== id));
    };

    const getCategoryName = (categoryId) => {
      return categories.find(c => c.id === categoryId)?.name || 'Sem categoria';
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">serviços</h1>
            <p className="text-gray-600 mt-1">gerencie todos os serviços oferecidos</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ backgroundColor: user.primaryColor }}
            className="flex items-center gap-2 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            <Plus className="w-5 h-5" />
            novo serviço
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="buscar serviço..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">todas categorias</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">preço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">duração</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredServices.map(service => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{service.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {getCategoryName(service.categoryId)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">R$ {service.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-900">{service.duration} min</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      service.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.active ? 'ativo' : 'inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingService ? 'editar serviço' : 'novo serviço'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingService(null);
                    setFormData({ name: '', categoryId: '', price: '', duration: '', active: true });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">nome do serviço</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="ex: Corte + Escova"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">categoria</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">selecione uma categoria</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">preço (R$)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">duração (min)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="30"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-gray-700">
                    serviço ativo
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingService(null);
                      setFormData({ name: '', categoryId: '', price: '', duration: '', active: true });
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    style={{ backgroundColor: user.primaryColor }}
                    className="flex-1 text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition"
                  >
                    salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Employees Page
  const EmployeesPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [formData, setFormData] = useState({
      name: '',
      phone: '',
      email: '',
      specialties: [],
      active: true
    });

    const handleSave = () => {
      if (editingEmployee) {
        setEmployees(employees.map(e => e.id === editingEmployee.id ? { ...e, ...formData } : e));
      } else {
        setEmployees([...employees, { id: Date.now().toString(), ...formData }]);
      }
      setShowModal(false);
      setFormData({ name: '', phone: '', email: '', specialties: [], active: true });
      setEditingEmployee(null);
    };

    const handleEdit = (employee) => {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        phone: employee.phone,
        email: employee.email,
        specialties: employee.specialties,
        active: employee.active
      });
      setShowModal(true);
    };

    const handleDelete = (id) => {
      setEmployees(employees.filter(e => e.id !== id));
    };

    const toggleSpecialty = (serviceId) => {
      const newSpecialties = formData.specialties.includes(serviceId)
        ? formData.specialties.filter(id => id !== serviceId)
        : [...formData.specialties, serviceId];
      setFormData({ ...formData, specialties: newSpecialties });
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">funcionários</h1>
            <p className="text-gray-600 mt-1">gerencie sua equipe</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ backgroundColor: user.primaryColor }}
            className="flex items-center gap-2 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            <Plus className="w-5 h-5" />
            novo funcionário
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map(employee => (
            <div key={employee.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-purple-600">
                      {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      employee.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {employee.active ? 'ativo' : 'inativo'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>📱</span>
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✉️</span>
                  <span>{employee.email}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">especialidades:</p>
                <div className="flex flex-wrap gap-1">
                  {employee.specialties.map(serviceId => {
                    const service = services.find(s => s.id === serviceId);
                    return service ? (
                      <span key={serviceId} className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-50 text-purple-700">
                        {service.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingEmployee ? 'editar funcionário' : 'novo funcionário'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingEmployee(null);
                    setFormData({ name: '', phone: '', email: '', specialties: [], active: true });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">nome completo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="ex: Ana Paula Silva"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">telefone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="85999999999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="nome@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">especialidades</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {services.map(service => (
                      <label key={service.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.specialties.includes(service.id)}
                          onChange={() => toggleSpecialty(service.id)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">{service.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="employeeActive"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="employeeActive" className="text-sm font-medium text-gray-700">
                    funcionário ativo
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingEmployee(null);
                      setFormData({ name: '', phone: '', email: '', specialties: [], active: true });
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    style={{ backgroundColor: user.primaryColor }}
                    className="flex-1 text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition"
                  >
                    salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Settings Page
  const SettingsPage = () => {
    const [settings, setSettings] = useState({
      barbershopName: user.barbershopName,
      primaryColor: user.primaryColor,
      secondaryColor: user.secondaryColor,
      darkMode: user.darkMode,
      businessHoursStart: '09:00',
      businessHoursEnd: '18:00',
      workingDays: ['seg', 'ter', 'qua', 'qui', 'sex', 'sab'],
      minBookingAdvance: 60
    });

    const weekDays = [
      { id: 'seg', label: 'seg' },
      { id: 'ter', label: 'ter' },
      { id: 'qua', label: 'qua' },
      { id: 'qui', label: 'qui' },
      { id: 'sex', label: 'sex' },
      { id: 'sab', label: 'sáb' },
      { id: 'dom', label: 'dom' }
    ];

    const toggleWorkingDay = (day) => {
      const newDays = settings.workingDays.includes(day)
        ? settings.workingDays.filter(d => d !== day)
        : [...settings.workingDays, day];
      setSettings({ ...settings, workingDays: newDays });
    };

    const handleSave = () => {
      setUser({
        ...user,
        barbershopName: settings.barbershopName,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        darkMode: settings.darkMode
      });
      alert('configurações salvas com sucesso!');
    };

    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">configurações</h1>
          <p className="text-gray-600 mt-1">personalize seu sistema</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">informações do negócio</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  nome do estabelecimento
                </label>
                <input
                  type="text"
                  value={settings.barbershopName}
                  onChange={(e) => setSettings({ ...settings, barbershopName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Scissors className="w-8 h-8 text-purple-600" />
                  </div>
                  <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
                    fazer upload
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">personalização visual</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  cor primária
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-16 h-12 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  cor secundária
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="w-16 h-12 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-3">prévia:</p>
              <div className="flex gap-2">
                <button style={{ backgroundColor: settings.primaryColor }} className="flex-1 text-white py-2 rounded-lg font-medium">
                  botão primário
                </button>
                <button style={{ backgroundColor: settings.secondaryColor }} className="flex-1 text-white py-2 rounded-lg font-medium">
                  botão secundário
                </button>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">horário de funcionamento</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  horário de abertura
                </label>
                <input
                  type="time"
                  value={settings.businessHoursStart}
                  onChange={(e) => setSettings({ ...settings, businessHoursStart: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  horário de fechamento
                </label>
                <input
                  type="time"
                  value={settings.businessHoursEnd}
                  onChange={(e) => setSettings({ ...settings, businessHoursEnd: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                dias de funcionamento
              </label>
              <div className="flex gap-2">
                {weekDays.map(day => (
                  <button
                    key={day.id}
                    onClick={() => toggleWorkingDay(day.id)}
                    className={`flex-1 py-2 rounded-lg font-medium transition ${
                      settings.workingDays.includes(day.id)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                antecedência mínima para agendamento (minutos)
              </label>
              <input
                type="number"
                value={settings.minBookingAdvance}
                onChange={(e) => setSettings({ ...settings, minBookingAdvance: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">integração google calendar</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-900">conectado</p>
                  <p className="text-sm text-green-700">agenda sincronizada: Agenda Principal</p>
                </div>
              </div>
            </div>

            <button className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
              reconectar google calendar
            </button>
          </div>

          <div className="border-t pt-6">
            <button
              onClick={handleSave}
              style={{ backgroundColor: settings.primaryColor }}
              className="w-full text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
            >
              salvar configurações
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Sidebar
  const Sidebar = () => {
    const menuItems = [
      { id: 'dashboard', label: 'dashboard', icon: LayoutDashboard },
      { id: 'appointments', label: 'agendamentos', icon: Calendar },
      { id: 'categories', label: 'categorias', icon: Scissors },
      { id: 'services', label: 'serviços', icon: Clock },
      { id: 'employees', label: 'funcionários', icon: Users },
      { id: 'settings', label: 'configurações', icon: Settings },
    ];

    return (
      <div className="w-64 bg-white border-r border-gray-200 h-screen p-4 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Scissors className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{user.barbershopName}</h2>
              <p className="text-xs text-gray-500">agenda pro</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              style={currentPage === item.id ? { backgroundColor: `${user.primaryColor}15`, color: user.primaryColor } : {}}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentPage === item.id
                  ? 'font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-4 border-t border-gray-200">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition"
          >
            sair
          </button>
        </div>
      </div>
    );
  };

  // Main Layout
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'categories' && <CategoriesPage />}
        {currentPage === 'services' && <ServicesPage />}
        {currentPage === 'employees' && <EmployeesPage />}
        {currentPage === 'settings' && <SettingsPage />}
        {currentPage === 'appointments' && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">página de agendamentos</p>
            <p className="text-gray-400 text-sm mt-2">aqui você verá todos os agendamentos do google calendar</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

