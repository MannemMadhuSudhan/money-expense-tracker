const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/money_tracker_db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define Expense model schema
const Expense = mongoose.model('Expense', {
    category: String,
    amount: Number,
    date: Date
});

app.post('/expenses', async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save();
        console.log('Expense added:', expense);
        res.status(201).send(expense);
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(400).send({ error: 'Failed to add expense' });
    }
});

app.delete('/expenses/:id', async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) {
            return res.status(404).send({ error: 'Expense not found' });
        }
        console.log('Expense deleted:', expense);
        res.send(expense);
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).send({ error: 'Failed to delete expense' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
