const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-super-secret-key-123';

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Папка для аватаров
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);
app.use('/uploads', express.static(UPLOADS_DIR));

// MIDDLEWARE: проверка JWT
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Не авторизован' });
  }
  try {
    const payload = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Токен недействителен' });
  }
}

// Настройка multer 
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar_${req.user.id}_${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase()) &&
               allowed.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Только изображения (jpg, png, webp)'));
  }
});

// БАЗЫ ДАННЫХ
const dbUsers = new sqlite3.Database('./users.db');
const dbProducts = new sqlite3.Database('./products.db');
const dbOrders = new sqlite3.Database('./orders.db');

//  USERS DB 
dbUsers.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT,
  avatar TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Добавляем колонку avatar если её нет 
dbUsers.run(`ALTER TABLE users ADD COLUMN avatar TEXT`, () => {});

//  PRODUCTS DB
dbProducts.serialize(() => {
  dbProducts.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  )`);

  dbProducts.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    is_available INTEGER DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  )`);

  dbProducts.run(`INSERT OR IGNORE INTO categories (id, name) VALUES
    (1, 'Суши'), 
    (2, 'Роллы'), 
    (3, 'Закуски'), 
    (4, 'Основные блюда'), 
    (5, 'Супы'), 
    (6, 'Десерты')
  `);

  dbProducts.run(`INSERT OR IGNORE INTO products (id, category_id, name, description, price, image, is_available) VALUES
  (1, 1, 'Суши с лососем', 'Свежий лосось на подушке из риса с васаби', 189, '/img/sushi-salmon.png', 1),
  (2, 1, 'Суши с тунцом', 'Магуро — нежный тунец высшего качества', 209, '/img/sushi-tuna.png', 1),
  (3, 1, 'Суши с креветкой', 'Отварная тигровая креветка на рисе', 179, '/img/sushi-shrimp.png', 1),
  (4, 1, 'Суши с угрём', 'Унаги в соусе терияки', 229, '/img/sushi-unagi.png', 1),
  (5, 2, 'Калифорния', 'Классический ролл с крабом, авокадо и огурцом', 449, '/img/roll-california.png', 1),
  (6, 2, 'Филадельфия', 'Лосось, сливочный сыр и авокадо', 479, '/img/roll-philadelphia.png', 1),
  (7, 2, 'Роллы Канада', 'Горячий ролл с лососем, авокадо и соусом терияки', 529, '/img/roll-kanada.png', 1),
  (8, 2, 'Эби Цезарь', 'Креветки темпура, сливочный сыр, салат айсберг, томат, соус цезарь, пармезан', 599, '/img/roll-ebiCesar.png', 1),
  (9,  3, 'Ика фрай', 'Кольца кальмара в хрустящей панировке с соусом фрай', 699, '/img/ikaFrai.png', 1),
  (10, 3, 'Харумаки с лососем', 'Хрустящие спринг-роллы с начинкой из лосося', 399, '/img/harumakiLos.png', 1),
  (11, 3, 'Хрустящие баклажаны', 'С сыром, кедровыми орехами, томатами черри и соусом тайский чили', 329, '/img/baklashan.png', 1),
  (12, 3, 'Хрустящие тигровые креветки', 'Тигровые креветки в хрустящей панировке', 249, '/img/crevetki.png', 1),
  (13, 4, 'Говядина в соусе из черных бобов', 'Говядина с овощами в ароматном соусе из чёрных бобов', 909, '/img/beef-black-bean.png', 1),
  (14, 4, 'Свинина в кисло-сладком соусе', 'Свинина с ананасом и овощами в кисло-сладком соусе', 579, '/img/sweet-sour-pork.png', 1),
  (15, 4, 'Цыпленок с картофелем и грибами', 'Нежный цыпленок тушёный с картофелем и шампиньонами', 629, '/img/chicken-potato-mushroom.png', 1),
  (16, 4, 'Тонкацу', 'Свиная отбивная в хрустящей панировке с рисом и соусом', 679, '/img/tonkatsu.png', 1),
  (17, 4, 'Цыпленок Гунбао', 'Филе цыплёнка, обжаренное с огурцами, морковью, луком и арахисом в соусе чили гарлик', 589, '/img/gongbao-chicken.png', 1),
  (18, 5, 'Мисо суп классический', 'С тофу, вакаме и зелёным луком', 199, '/img/miso-soup.png', 1),
  (19, 5, 'Том Ям', 'Тайский острый суп с креветками', 279, '/img/tomIm.png', 1),
  (20, 5, 'Суп сырный', 'С копчёным беконом, зеленью и луком фри', 299, '/img/soup-cheese.png', 1),
  (21, 5, 'Рамен с курицей кацу', 'Пшеничная лапша в насыщенном бульоне с хрустящей курицей', 329, '/img/ramen-katsu.png', 1),
  (22, 6, 'Коконатсу', 'Блинчик с начинкой из клубники и банана со сливочным кремом и грецкими орехами', 489, '/img/kokonatsu.png', 1),
  (23, 6, 'Чизкейк с маракуйей', 'Творожный сыр и желе из маракуйи', 519, '/img/cheesecake-marakuya.png', 1),
  (24, 6, 'Шоколадный ролл', 'Какао-блинчик с начинкой из карамели и шоколадного крема', 489, '/img/chokolateRoll.png', 1),
  (25, 6, 'Клубничный Дайфуку', 'Свежая клубника в обволакивающем моти с пастой анко', 349, '/img/clubnikaDaifuku.png', 1),
  (26, 6, 'Митараси Данго', 'Рисовые шарики на шпажке в сладко-солёном соусе', 359, '/img/mitarasiDango.png', 1)
  `);

  console.log('✅ БД products.db готова: японская кухня (6 категорий, 24 блюда)');
});

// === ORDERS DB ===
dbOrders.serialize(() => {
  dbOrders.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_comment TEXT,
    payment_method TEXT DEFAULT 'cash',
    total_amount REAL NOT NULL,
    items TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log('✅ БД orders.db готова!');
});

// === AUTH ROUTES ===
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    dbUsers.get('SELECT id FROM users WHERE email = ?', [email], async (err, user) => {
      if (user) return res.status(400).json({ error: 'Пользователь уже существует' });
      const hashedPassword = await bcrypt.hash(password, 10);
      dbUsers.run('INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword],
        function(err) {
          if (err) return res.status(500).json({ error: 'Ошибка сервера' });
          res.json({ message: 'Регистрация успешна', userId: this.lastID });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  dbUsers.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (!user) return res.status(400).json({ error: 'Неверные данные' });
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: 'Неверные данные' });
    const token = jwt.sign(
      { id: user.id, email: user.email, avatar: user.avatar || null },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ message: 'Вход успешен', token, user: { id: user.id, email: user.email, avatar: user.avatar } });
  });
});

// USER ROUTES
app.put('/user/email', authMiddleware, (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email обязателен' });

  dbUsers.get('SELECT id FROM users WHERE email = ? AND id != ?', [email, req.user.id], (err, existing) => {
    if (existing) return res.status(400).json({ error: 'Этот email уже занят' });
    dbUsers.run('UPDATE users SET email = ? WHERE id = ?', [email, req.user.id], function(err) {
      if (err) return res.status(500).json({ error: 'Ошибка сервера' });
      dbUsers.get('SELECT avatar FROM users WHERE id = ?', [req.user.id], (err, row) => {
        const token = jwt.sign(
          { id: req.user.id, email, avatar: row?.avatar || null },
          JWT_SECRET,
          { expiresIn: '1h' }
        );
        res.json({ message: 'Email обновлён', token });
      });
    });
  });
});

app.put('/user/password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Заполните все поля' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Пароль должен содержать минимум 6 символов' });
  }
  dbUsers.get('SELECT * FROM users WHERE id = ?', [req.user.id], async (err, user) => {
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return res.status(400).json({ error: 'Неверный текущий пароль' });
    const hashed = await bcrypt.hash(newPassword, 10);
    dbUsers.run('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id], (err) => {
      if (err) return res.status(500).json({ error: 'Ошибка сервера' });
      res.json({ message: 'Пароль успешно изменён' });
    });
  });
});

// ЗАГРУЗКА АВАТАРА
app.post('/user/avatar', authMiddleware, (req, res) => {
  upload.single('avatar')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'Файл не загружен' });

    const avatarUrl = `/uploads/${req.file.filename}`;

    // Удаляем старый аватар если есть
    dbUsers.get('SELECT avatar FROM users WHERE id = ?', [req.user.id], (err, row) => {
      if (row?.avatar) {
        const oldPath = path.join(__dirname, row.avatar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      dbUsers.run('UPDATE users SET avatar = ? WHERE id = ?', [avatarUrl, req.user.id], (err) => {
        if (err) return res.status(500).json({ error: 'Ошибка сервера' });

        // Возвращаем новый токен с обновлённым avatar
        const token = jwt.sign(
          { id: req.user.id, email: req.user.email, avatar: avatarUrl },
          JWT_SECRET,
          { expiresIn: '1h' }
        );
        res.json({ message: 'Аватар обновлён', avatar: avatarUrl, token });
      });
    });
  });
});

// УДАЛЕНИЕ АВАТАРА 
app.delete('/user/avatar', authMiddleware, (req, res) => {
  dbUsers.get('SELECT avatar FROM users WHERE id = ?', [req.user.id], (err, row) => {
    if (row?.avatar) {
      const oldPath = path.join(__dirname, row.avatar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    dbUsers.run('UPDATE users SET avatar = NULL WHERE id = ?', [req.user.id], (err) => {
      if (err) return res.status(500).json({ error: 'Ошибка сервера' });
      const token = jwt.sign(
        { id: req.user.id, email: req.user.email, avatar: null },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ message: 'Аватар удалён', token });
    });
  });
});

// MENU ROUTES
app.get('/categories', (req, res) => {
  dbProducts.all('SELECT * FROM categories ORDER BY id', (err, rows) => {
    res.json(rows || []);
  });
});

app.get('/products', (req, res) => {
  const { category } = req.query;
  const sql = category
    ? `SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE c.name = ? AND p.is_available = 1 ORDER BY p.name`
    : `SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.is_available = 1 ORDER BY c.name, p.name`;
  dbProducts.all(sql, category ? [category] : [], (err, rows) => {
    res.json(rows || []);
  });
});

// === ORDERS ROUTES ===
app.post('/orders', (req, res) => {
  const {
    customer: { name, phone, address, comment, paymentMethod },
    totalAmount,
    items
  } = req.body;

  if (!name || !phone || !address || !items || items.length === 0) {
    return res.status(400).json({ error: 'Заполните обязательные поля' });
  }

  const itemsJson = JSON.stringify(items.map(item => ({
    id: item.id, name: item.name, quantity: item.quantity, price: item.price
  })));

  dbOrders.run(
    `INSERT INTO orders (customer_name, customer_phone, customer_address, customer_comment, payment_method, total_amount, items, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, phone, address, comment || '', paymentMethod || 'cash', totalAmount, itemsJson, 'new'],
    function(err) {
      if (err) {
        console.error('Ошибка сохранения заказа:', err);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      console.log(`✅ Новый заказ #${this.lastID} на ${totalAmount}₽ от ${name}`);
      res.json({ success: true, orderId: this.lastID, message: 'Заказ успешно создан!' });
    }
  );
});

app.get('/orders', (req, res) => {
  dbOrders.all(`
    SELECT id, customer_name, customer_phone, total_amount, 
           status, created_at, json_extract(items, '$.length') as items_count 
    FROM orders ORDER BY created_at DESC
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Ошибка сервера' });
    res.json(rows || []);
  });
});

app.get('/orders/:id', (req, res) => {
  const { id } = req.params;
  dbOrders.get(`SELECT *, items FROM orders WHERE id = ?`, [id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Заказ не найден' });
    row.items = JSON.parse(row.items);
    res.json(row);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📋 Роуты: /products, /categories, /orders, /login, /register, /user/email, /user/password, /user/avatar`);
});