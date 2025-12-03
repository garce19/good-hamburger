const db = require('../config/database');

const getAllMenuItems = async (req, res, next) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM menu_items ORDER BY type, id'
        );

        res.json({
            success: true,
            data: rows
        });
    } catch (err) {
        next(err);
    }
};

const getSandwiches = async (req, res, next) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM menu_items WHERE type = 'sandwich' ORDER BY id"
        )

        res.json({
            success: true,
            data: rows
        });

    } catch (err) {
        next(err);
    };
};

const getExtras = async (req, res, next) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM menu_items WHERE type = 'extra' ORDER BY id"
        )
        res.json({
            success: true,
            data: rows
        });
    } catch (err) {
        next(err);
    };
};

module.exports = {
    getAllMenuItems,
    getSandwiches,
    getExtras
};