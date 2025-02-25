import { DataTypes } from 'sequelize'
import { db_main } from '../config/db-config.js'
import { ROLES } from '../shared/constants/roles-const.js'
import { QUOTE } from '../shared/constants/payment-const.js'
import { KARDEX } from '../shared/constants/kardexValues-const.js'
import { STATUS_ACCESS, TYPE_ACCESS } from '../shared/constants/access-const.js'

// ====================================== MODULE SYSTEM CONFIG ====================================== //

// CONFIG GENERAL
export const system_config_Schema = db_main.define(
	'system_config',
	{
		id_config: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		institution_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		institution_logo: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		slogan: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		contact_email: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				isEmail: true,
			},
		},
		contact_phone: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		address: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		fb: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		x: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		ig: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		yt: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		yt: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		number_sample: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		secuence_quote: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'system_config',
	}
)

// ====================================== MODULE USERS ====================================== //

// ROLES
export const rol_Schema = db_main.define(
	'roles',
	{
		id_rol: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		type_rol: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isIn: [[ROLES.GENERAL_ADMIN, ROLES.DIRECTOR, ROLES.SUPERVISOR, ROLES.TECHNICAL_ANALYST, ROLES.ACCESS_MANAGER]],
			},
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'roles',
	}
)

// USERS
export const user_Schema = db_main.define(
	'users',
	{
		id_user: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		full_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING(),
			allowNull: true,
			validate: {
				is: /^[0-9]+$/,
			},
		},
		identification_card: {
			type: DataTypes.STRING(),
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		code: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'users',
	}
)

// USERS <=> ROLES - INTERMEDIATE
export const user_role_main_Schema = db_main.define(
	'user_roles_intermediate',
	{
		id_user_role_intermediate: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_user_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'users',
				key: 'id_user',
			},
		},
	},
	{
		timestamps: true,
		tableName: 'user_roles_intermediate',
	}
)

user_role_main_Schema.belongsTo(user_Schema, {
	foreignKey: 'id_user_fk',
	sourceKey: 'id_user',
	onDelete: 'SET NULL',
})
user_Schema.hasOne(user_role_main_Schema, {
	foreignKey: 'id_user_fk',
	targetKey: 'id_user',
	onDelete: 'SET NULL',
})

// USERS <=> ROLES
export const user_roles_Schema = db_main.define(
	'user_roles',
	{
		id_user_roles: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_user_role_intermediate_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'user_roles_intermediate',
				key: 'id_user_role_intermediate',
			},
		},
		id_rol_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'roles',
				key: 'id_rol',
			},
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'user_roles',
	}
)

user_roles_Schema.belongsTo(user_role_main_Schema, {
	foreignKey: 'id_user_role_intermediate_fk',
	sourceKey: 'id_user_role_intermediate',
	onDelete: 'SET NULL',
})
user_role_main_Schema.hasMany(user_roles_Schema, {
	foreignKey: 'id_user_role_intermediate_fk',
	targetKey: 'id_user_role_intermediate',
	onDelete: 'SET NULL',
})

user_roles_Schema.belongsTo(rol_Schema, {
	foreignKey: 'id_rol_fk',
	sourceKey: 'id_rol',
	onDelete: 'SET NULL',
})
rol_Schema.hasMany(user_roles_Schema, {
	foreignKey: 'id_rol_fk',
	targetKey: 'id_rol',
	onDelete: 'SET NULL',
})

user_roles_Schema.belongsTo(user_Schema, {
	foreignKey: 'id_user_role_intermediate_fk',
	sourceKey: 'id_user_fk',
	onDelete: 'SET NULL',
})
user_Schema.hasMany(user_roles_Schema, {
	foreignKey: 'id_user_role_intermediate_fk',
	targetKey: 'id_user_fk',
	onDelete: 'SET NULL',
})

// ====================================== MODULE LABORATORY ====================================== //

// LABORATORY
export const laboratory_Schema = db_main.define(
	'laboratories',
	{
		id_lab: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		location: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'laboratories',
	}
)

// LABORATORY <=> TECHNICAL ANALYSIS
export const laboratory_analyst_Schema = db_main.define(
	'laboratory_analysts',
	{
		id_laboratory_analysts: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_lab_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'laboratories',
				key: 'id_lab',
			},
		},
		id_analyst_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'users',
				key: 'id_user',
			},
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'laboratory_analysts',
	}
)

laboratory_Schema.hasOne(laboratory_analyst_Schema, {
	foreignKey: 'id_lab_fk',
	onDelete: 'SET NULL',
})
laboratory_analyst_Schema.belongsTo(laboratory_Schema, {
	foreignKey: 'id_lab_fk',
	onDelete: 'SET NULL',
})

laboratory_analyst_Schema.belongsTo(user_Schema, {
	foreignKey: 'id_analyst_fk',
	onDelete: 'SET NULL',
})
user_Schema.hasOne(laboratory_analyst_Schema, {
	foreignKey: 'id_analyst_fk',
	onDelete: 'SET NULL',
})

// ====================================== MODULE FACULTY ====================================== //

// FACULTY
export const faculty_Scheme = db_main.define(
	'faculties',
	{
		id_faculty: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'faculties',
	}
)

// ====================================== MODULE CAREEER ====================================== //

// CAREEER
export const career_Scheme = db_main.define(
	'careers',
	{
		id_career: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		id_faculty_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'faculties',
				key: 'id_faculty',
			},
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'careers',
	}
)

faculty_Scheme.hasMany(career_Scheme, {
	foreignKey: 'id_faculty_fk',
	sourceKey: 'id_faculty',
	onDelete: 'SET NULL',
})
career_Scheme.belongsTo(faculty_Scheme, {
	foreignKey: 'id_faculty_fk',
	sourceKey: 'id_faculty',
	onDelete: 'SET NULL',
})

// ====================================== MODULE ANALISIS ====================================== //

// CATEGORY
export const experiments_category_Scheme = db_main.define(
	'experiments_categories',
	{
		id_experiment_category: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'experiments_categories',
	}
)

// PARAMETERS
export const experiments_parameter_Scheme = db_main.define(
	'experiments_parameters',
	{
		id_experiment_parameter: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_experiment_category_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'experiments_categories',
				key: 'id_experiment_category',
			},
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		public_price: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		status: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'experiments_parameters',
	}
)

experiments_parameter_Scheme.belongsTo(experiments_category_Scheme, {
	foreignKey: 'id_experiment_category_fk',
	targetKey: 'id_experiment_category',
	onDelete: 'SET NULL',
})
experiments_category_Scheme.hasMany(experiments_parameter_Scheme, {
	foreignKey: 'id_experiment_category_fk',
	sourceKey: 'id_experiment_category',
	onDelete: 'SET NULL',
})

// ====================================== MODULE QUOTES ====================================== //

// QUOTES
export const quotes_Scheme = db_main.define(
	'quotes',
	{
		id_quote: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		code: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		type_quote: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		direction: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		dni: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		type_quote: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		type_sample: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		amount_sample: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		detail_sample: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		status: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: QUOTE.PENDING,
			validate: {
				isIn: [[QUOTE.PENDING, QUOTE.APPROVED, QUOTE.REJECTD]],
			},
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'quotes',
	}
)

// QUOTES <=> LABS
export const quotes_labs_Scheme = db_main.define(
	'quotes_labs',
	{
		id_quote_lab: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_quote_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'quotes',
				key: 'id_quote',
			},
		},
		id_lab_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'laboratories',
				key: 'id_lab',
			},
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'quotes_labs',
	}
)

quotes_Scheme.hasMany(quotes_labs_Scheme, {
	foreignKey: 'id_quote_fk',
	sourceKey: 'id_quote',
	onDelete: 'SET NULL',
})
quotes_labs_Scheme.belongsTo(quotes_Scheme, {
	foreignKey: 'id_quote_fk',
	targetKey: 'id_quote',
	onDelete: 'SET NULL',
})

laboratory_Schema.hasMany(quotes_labs_Scheme, {
	foreignKey: 'id_lab_fk',
	sourceKey: 'id_lab',
	onDelete: 'SET NULL',
})
quotes_labs_Scheme.belongsTo(laboratory_Schema, {
	foreignKey: 'id_lab_fk',
	targetKey: 'id_lab',
	onDelete: 'SET NULL',
})

// QUOTES <=> EXPERIMENT
export const quotes_experiments_Scheme = db_main.define(
	'quotes_experiments',
	{
		id_quote_experiment: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_quote_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'quotes',
				key: 'id_quote',
			},
		},
		id_experiment_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'experiments_parameters',
				key: 'id_experiment_parameter',
			},
		},
		amount: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		total_cost: {
			type: DataTypes.FLOAT,
			allowNull: true,
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'quotes_experiments',
	}
)

quotes_Scheme.hasMany(quotes_experiments_Scheme, {
	foreignKey: 'id_quote_fk',
	sourceKey: 'id_quote',
	onDelete: 'SET NULL',
})
quotes_experiments_Scheme.belongsTo(quotes_Scheme, {
	foreignKey: 'id_quote_fk',
	targetKey: 'id_quote',
	onDelete: 'SET NULL',
})

experiments_parameter_Scheme.hasMany(quotes_experiments_Scheme, {
	foreignKey: 'id_experiment_fk',
	sourceKey: 'id_experiment_parameter',
	onDelete: 'SET NULL',
})
quotes_experiments_Scheme.belongsTo(experiments_parameter_Scheme, {
	foreignKey: 'id_experiment_fk',
	targetKey: 'id_experiment_parameter',
	onDelete: 'SET NULL',
})

// QUOTES <=> PAYMENT
export const quotes_payments_Scheme = db_main.define(
	'quotes_payments',
	{
		id_quote_payment: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_quote_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'quotes',
				key: 'id_quote',
			},
		},
		bill: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		pdfQuote: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'quotes_payments',
	}
)

quotes_Scheme.hasOne(quotes_payments_Scheme, {
	foreignKey: 'id_quote_fk',
	targetKey: 'id_quote',
	onDelete: 'SET NULL',
})
quotes_payments_Scheme.belongsTo(quotes_Scheme, {
	foreignKey: 'id_quote_fk',
	targetKey: 'id_quote',
	onDelete: 'SET NULL',
})

// QUOTES <=> PDF
export const quotes_pdf_Scheme = db_main.define(
	'quotes_pdf',
	{
		id_quote_pdf: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_quote_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'quotes',
				key: 'id_quote',
			},
		},
		pdfQuote: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'quotes_pdf',
	}
)

quotes_Scheme.hasOne(quotes_pdf_Scheme, {
	foreignKey: 'id_quote_fk',
	targetKey: 'id_quote',
	onDelete: 'SET NULL',
})
quotes_pdf_Scheme.belongsTo(quotes_Scheme, {
	foreignKey: 'id_quote_fk',
	targetKey: 'id_quote',
	onDelete: 'SET NULL',
})

// ====================================== MODULE ACCESS ====================================== //

// ACCESS
export const access_Scheme = db_main.define(
	'access',
	{
		id_access: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_quote_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'quotes',
				key: 'id_quote',
			},
		},
		code: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		resolution_approval: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		reason: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		topic: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		datePermanenceStart: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		datePermanenceEnd: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		observations: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		grupe: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		attached: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		clauses: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: STATUS_ACCESS.PENDING,
			validate: {
				isIn: [[STATUS_ACCESS.PENDING, STATUS_ACCESS.APPROVED, STATUS_ACCESS.REJECTED]],
			},
		},
		type_access: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: 'access_internal',
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'access',
	}
)

quotes_Scheme.hasOne(access_Scheme, {
	foreignKey: 'id_quote_fk',
	targetKey: 'id_quote',
	onDelete: 'SET NULL',
})
access_Scheme.belongsTo(quotes_Scheme, {
	foreignKey: 'id_quote_fk',
	targetKey: 'id_quote',
	onDelete: 'SET NULL',
})

// ACCESS <=> FACULTY
export const access_faculty_Scheme = db_main.define(
	'access_faculty',
	{
		id_access_faculty: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_access_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'access',
				key: 'id_access',
			},
		},
		id_faculty_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'faculties',
				key: 'id_faculty',
			},
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'access_faculty',
	}
)

access_faculty_Scheme.belongsTo(access_Scheme, {
	foreignKey: 'id_access_fk',
	targetKey: 'id_access',
	onDelete: 'SET NULL',
})
access_Scheme.hasMany(access_faculty_Scheme, {
	foreignKey: 'id_access_fk',
	sourceKey: 'id_access',
	onDelete: 'SET NULL',
})

access_faculty_Scheme.belongsTo(faculty_Scheme, {
	foreignKey: 'id_faculty_fk',
	targetKey: 'id_faculty',
	onDelete: 'SET NULL',
})
faculty_Scheme.hasMany(access_faculty_Scheme, {
	foreignKey: 'id_faculty_fk',
	sourceKey: 'id_faculty',
	onDelete: 'SET NULL',
})

// ACCESS <=> CAREER
export const access_career_Scheme = db_main.define(
	'access_career',
	{
		id_access_career: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_access_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'access',
				key: 'id_access',
			},
		},
		id_career_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'careers',
				key: 'id_career',
			},
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'access_career',
	}
)

access_career_Scheme.belongsTo(access_Scheme, {
	foreignKey: 'id_access_fk',
	targetKey: 'id_access',
	onDelete: 'SET NULL',
})
access_Scheme.hasMany(access_career_Scheme, {
	foreignKey: 'id_access_fk',
	sourceKey: 'id_access',
	onDelete: 'SET NULL',
})

access_career_Scheme.belongsTo(career_Scheme, {
	foreignKey: 'id_career_fk',
	targetKey: 'id_career',
	onDelete: 'SET NULL',
})
career_Scheme.hasMany(access_career_Scheme, {
	foreignKey: 'id_career_fk',
	sourceKey: 'id_career',
	onDelete: 'SET NULL',
})

// ACCESS <=> DIRECTOR
export const access_director_Scheme = db_main.define(
	'access_director',
	{
		id_access_director: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_access_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'access',
				key: 'id_access',
			},
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		dni: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'access_director',
	}
)

access_director_Scheme.belongsTo(access_Scheme, {
	foreignKey: 'id_access_fk',
	targetKey: 'id_access',
	onDelete: 'SET NULL',
})
access_Scheme.hasMany(access_director_Scheme, {
	foreignKey: 'id_access_fk',
	sourceKey: 'id_access',
	onDelete: 'SET NULL',
})

// ACCESS <=> APLICANTS
export const access_applicant_Scheme = db_main.define(
	'access_applicants',
	{
		id_access_applicant: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_access_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'access',
				key: 'id_access',
			},
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		dni: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'access_applicants',
	}
)

access_applicant_Scheme.belongsTo(access_Scheme, {
	foreignKey: 'id_access_fk',
	targetKey: 'id_access',
	onDelete: 'SET NULL',
})
access_Scheme.hasMany(access_applicant_Scheme, {
	foreignKey: 'id_access_fk',
	sourceKey: 'id_access',
	onDelete: 'SET NULL',
})

// ACCESS <=> LABS
export const access_lab_Scheme = db_main.define(
	'access_labs',
	{
		id_access_lab: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_access_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'access',
				key: 'id_access',
			},
		},
		id_lab_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'laboratories',
				key: 'id_lab',
			},
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'access_labs',
	}
)

access_lab_Scheme.belongsTo(access_Scheme, {
	foreignKey: 'id_access_fk',
	targetKey: 'id_access',
	onDelete: 'SET NULL',
})
access_Scheme.hasMany(access_lab_Scheme, {
	foreignKey: 'id_access_fk',
	sourceKey: 'id_access',
	onDelete: 'SET NULL',
})

laboratory_Schema.hasMany(access_lab_Scheme, {
	foreignKey: 'id_lab_fk',
	sourceKey: 'id_lab',
	onDelete: 'SET NULL',
})
access_lab_Scheme.belongsTo(laboratory_Schema, {
	foreignKey: 'id_lab_fk',
	targetKey: 'id_lab',
	onDelete: 'SET NULL',
})

// ACCESS <=> ANALYSIS
export const access_analysis_Scheme = db_main.define(
	'access_analysis',
	{
		id_access_analysis: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_access_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'access',
				key: 'id_access',
			},
		},
		id_experiment_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'experiments_parameters',
				key: 'id_experiment_parameter',
			},
		},
		amount: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		total_cost: {
			type: DataTypes.FLOAT,
			allowNull: true,
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'access_analysis',
	}
)

access_analysis_Scheme.belongsTo(access_Scheme, {
	foreignKey: 'id_access_fk',
	targetKey: 'id_access',
	onDelete: 'SET NULL',
})
access_Scheme.hasMany(access_analysis_Scheme, {
	foreignKey: 'id_access_fk',
	sourceKey: 'id_access',
	onDelete: 'SET NULL',
})

experiments_parameter_Scheme.hasMany(access_analysis_Scheme, {
	foreignKey: 'id_experiment_fk',
	sourceKey: 'id_experiment_parameter',
	onDelete: 'SET NULL',
})
access_analysis_Scheme.belongsTo(experiments_parameter_Scheme, {
	foreignKey: 'id_experiment_fk',
	targetKey: 'id_experiment_parameter',
	onDelete: 'SET NULL',
})

// ====================================== MODULE UNIT MEASUREMENT ====================================== //

// UNITS
export const unit_measurement_Schema = db_main.define(
	'units_measurements',
	{
		id_unit_measurement: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		unit: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'units_measurements',
	}
)

// ====================================== MODULE REACTIVES ====================================== //

// REACTIVES
export const reactive_Schema = db_main.define(
	'reactives',
	{
		id_reactive: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		status: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			allowNull: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		code: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		number_of_containers: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		current_quantity: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		id_unit_measurement_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'units_measurements',
				key: 'id_unit_measurement',
			},
		},
		cas: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		expiration_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		control_tracking: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'reactives',
	}
)

reactive_Schema.belongsTo(unit_measurement_Schema, {
	foreignKey: 'id_unit_measurement_fk',
	targetKey: 'id_unit_measurement',
	onDelete: 'SET NULL',
})
unit_measurement_Schema.hasMany(reactive_Schema, {
	foreignKey: 'id_unit_measurement_fk',
	targetKey: 'id_unit_measurement',
	onDelete: 'SET NULL',
})

// ====================================== MODULE SAMPLES ====================================== //

// SAMPLES
export const sample_Schema = db_main.define(
	'samples',
	{
		id_sample: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_quote_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'quotes',
				key: 'id_quote',
			},
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		amount: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		id_unit_measurement_dk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'units_measurements',
				key: 'id_unit_measurement',
			},
		},
		container: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		id_analyst_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'users',
				key: 'id_user',
			},
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'samples',
	}
)

sample_Schema.belongsTo(quotes_Scheme, {
	foreignKey: 'id_quote_fk',
	targetKey: 'id_quote',
	onDelete: 'SET NULL',
})
quotes_Scheme.hasMany(sample_Schema, {
	foreignKey: 'id_quote_fk',
	sourceKey: 'id_quote',
	onDelete: 'SET NULL',
})

user_Schema.hasMany(sample_Schema, {
	foreignKey: 'id_analyst_fk',
	sourceKey: 'id_user',
	onDelete: 'SET NULL',
})
sample_Schema.belongsTo(user_Schema, {
	foreignKey: 'id_analyst_fk',
	targetKey: 'id_user',
	onDelete: 'SET NULL',
})

unit_measurement_Schema.hasMany(sample_Schema, {
	foreignKey: 'id_unit_measurement_dk',
	sourceKey: 'id_unit_measurement',
	onDelete: 'SET NULL',
})
sample_Schema.belongsTo(unit_measurement_Schema, {
	foreignKey: 'id_unit_measurement_dk',
	targetKey: 'id_unit_measurement',
	onDelete: 'SET NULL',
})

// SAMPLES <=> RESULT
export const sampleResult_Schema = db_main.define(
	'sample_result',
	{
		id_sample_result: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_sample_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'samples',
				key: 'id_sample',
			},
		},
		id_analysis_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'experiments_parameters',
				key: 'id_experiment_parameter',
			},
		},
		id_analyst_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'users',
				key: 'id_user',
			},
		},
		code_assigned_ueb: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		result: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'sample_result',
	}
)

experiments_parameter_Scheme.hasOne(sampleResult_Schema, {
	foreignKey: 'id_analysis_fk',
	sourceKey: 'id_experiment_parameter',
	onDelete: 'SET NULL',
})
sampleResult_Schema.belongsTo(experiments_parameter_Scheme, {
	foreignKey: 'id_analysis_fk',
	sourceKey: 'id_experiment_parameter',
	onDelete: 'SET NULL',
})

sample_Schema.hasMany(sampleResult_Schema, {
	foreignKey: 'id_sample_fk',
	sourceKey: 'id_sample',
	onDelete: 'SET NULL',
})
sampleResult_Schema.belongsTo(sample_Schema, {
	foreignKey: 'id_sample_fk',
	sourceKey: 'id_sample',
	onDelete: 'SET NULL',
})

user_Schema.hasMany(sampleResult_Schema, {
	foreignKey: 'id_analyst_fk',
	sourceKey: 'id_user',
	onDelete: 'SET NULL',
})
sampleResult_Schema.belongsTo(user_Schema, {
	foreignKey: 'id_analyst_fk',
	sourceKey: 'id_user',
	onDelete: 'SET NULL',
})

// SAMPLE <=> REPORT
export const sample_report_Schema = db_main.define(
	'sample_reports',
	{
		id_report: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		number: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 155,
		},
		senior_analyst: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'users',
				key: 'id_user',
			},
		},
		collaborating_analyst: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'users',
				key: 'id_user',
			},
		},
		code: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		isIssued: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false,
		},
		id_sample_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'samples',
				key: 'id_sample',
			},
		},
		id_quote_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'quotes',
				key: 'id_quote',
			},
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'sample_reports',
	}
)

// Para senior_analyst
user_Schema.hasMany(sample_report_Schema, {
	foreignKey: 'senior_analyst',
	sourceKey: 'id_user',
	onDelete: 'SET NULL',
	as: 'seniorAnalystReports',
})
sample_report_Schema.belongsTo(user_Schema, {
	foreignKey: 'senior_analyst',
	targetKey: 'id_user',
	onDelete: 'SET NULL',
	as: 'seniorAnalyst',
})

// Para collaborating_analyst
user_Schema.hasMany(sample_report_Schema, {
	foreignKey: 'collaborating_analyst',
	sourceKey: 'id_user',
	onDelete: 'SET NULL',
	as: 'collaboratingAnalystReports',
})
sample_report_Schema.belongsTo(user_Schema, {
	foreignKey: 'collaborating_analyst',
	targetKey: 'id_user',
	onDelete: 'SET NULL',
	as: 'collaboratingAnalyst',
})

sample_Schema.hasMany(sample_report_Schema, {
	foreignKey: 'id_sample_fk',
	sourceKey: 'id_sample',
	onDelete: 'SET NULL',
	as: 'samplesReports',
})

sample_report_Schema.belongsTo(sample_Schema, {
	foreignKey: 'id_sample_fk',
	targetKey: 'id_sample',
	onDelete: 'SET NULL',
	as: 'sample',
})

quotes_Scheme.hasMany(sample_report_Schema, {
	foreignKey: 'id_quote_fk',
	sourceKey: 'id_quote',
	onDelete: 'SET NULL',
})
sample_report_Schema.belongsTo(quotes_Scheme, {
	foreignKey: 'id_quote_fk',
	targetKey: 'id_quote',
	onDelete: 'SET NULL',
})

/* ------------------------------- CONSUMPTION - REACTIVE -----------------------------*/

export const consumptionReactive_Schema = db_main.define(
	'consumption_reactives',
	{
		id_consumption_reactive: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_quote_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'quotes',
				key: 'id_quote',
			},
		},
		id_reactive_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'reactives',
				key: 'id_reactive',
			},
		},
		id_analysis_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'experiments_parameters',
				key: 'id_experiment_parameter',
			},
		},
		id_lab_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'laboratories',
				key: 'id_lab',
			},
		},
		amount: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		id_analyst_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'users',
				key: 'id_user',
			},
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'consumption_reactives',
	}
)

consumptionReactive_Schema.belongsTo(quotes_Scheme, {
	foreignKey: 'id_quote_fk',
	targetKey: 'id_quote',
	onDelete: 'SET NULL',
})
quotes_Scheme.hasMany(consumptionReactive_Schema, {
	foreignKey: 'id_quote_fk',
	sourceKey: 'id_quote',
	onDelete: 'SET NULL',
})

user_Schema.hasMany(consumptionReactive_Schema, {
	foreignKey: 'id_analyst_fk',
	sourceKey: 'id_user',
	onDelete: 'SET NULL',
})
consumptionReactive_Schema.belongsTo(user_Schema, {
	foreignKey: 'id_analyst_fk',
	targetKey: 'id_user',
	onDelete: 'SET NULL',
})

reactive_Schema.hasMany(consumptionReactive_Schema, {
	foreignKey: 'id_reactive_fk',
	sourceKey: 'id_reactive',
	onDelete: 'SET NULL',
})
consumptionReactive_Schema.belongsTo(reactive_Schema, {
	foreignKey: 'id_reactive_fk',
	targetKey: 'id_reactive',
	onDelete: 'SET NULL',
})

laboratory_Schema.hasMany(consumptionReactive_Schema, {
	foreignKey: 'id_lab_fk',
	sourceKey: 'id_lab',
	onDelete: 'SET NULL',
})
consumptionReactive_Schema.belongsTo(laboratory_Schema, {
	foreignKey: 'id_lab_fk',
	targetKey: 'id_lab',
	onDelete: 'SET NULL',
})

experiments_parameter_Scheme.hasMany(consumptionReactive_Schema, {
	foreignKey: 'id_analysis_fk',
	sourceKey: 'id_experiment_parameter',
	onDelete: 'SET NULL',
})
consumptionReactive_Schema.belongsTo(experiments_parameter_Scheme, {
	foreignKey: 'id_analysis_fk',
	targetKey: 'id_experiment_parameter',
	onDelete: 'SET NULL',
})

// ====================================== MODULE KARDEX ====================================== //

// KRDEX
export const kardex_Schema = db_main.define(
	'kardex',
	{
		id_kardex: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_analysis_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'experiments_parameters',
				key: 'id_experiment_parameter',
			},
		},
		id_reactive_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'reactives',
				key: 'id_reactive',
			},
		},
		id_consumption_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'consumption_reactives',
				key: 'id_consumption_reactive',
			},
		},
		action_type: {
			type: DataTypes.ENUM(KARDEX.ADJUSTMENT, KARDEX.ENTRY, KARDEX.RETURN),
			allowNull: false,
		},
		id_responsible: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'users',
				key: 'id_user',
			},
		},
		quantity: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		balance_after_action: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		notes: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		isIndependent: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false,
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'kardex',
	}
)

kardex_Schema.belongsTo(reactive_Schema, {
	foreignKey: 'id_reactive_fk',
	targetKey: 'id_reactive',
	onDelete: 'SET NULL',
})
kardex_Schema.belongsTo(user_Schema, {
	foreignKey: 'id_responsible',
	targetKey: 'id_user',
	onDelete: 'SET NULL',
})

experiments_parameter_Scheme.hasMany(kardex_Schema, {
	foreignKey: 'id_analysis_fk',
	sourceKey: 'id_experiment_parameter',
	onDelete: 'SET NULL',
})
kardex_Schema.belongsTo(experiments_parameter_Scheme, {
	foreignKey: 'id_analysis_fk',
	targetKey: 'id_experiment_parameter',
	onDelete: 'SET NULL',
})

consumptionReactive_Schema.hasOne(kardex_Schema, {
	foreignKey: 'id_consumption_fk',
	sourceKey: 'id_consumption_reactive',
	onDelete: 'SET NULL',
})
kardex_Schema.belongsTo(consumptionReactive_Schema, {
	foreignKey: 'id_consumption_fk',
	targetKey: 'id_consumption_reactive',
	onDelete: 'SET NULL',
})

/* ------------------------------- TOKEN -----------------------------*/

export const token_Schema = db_main.define(
	'tokens',
	{
		id_token: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		id_user_fk: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id_user',
			},
		},
		token: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		used: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		tableName: 'tokens',
	}
)

// Relación Uno a Uno (1:1)
// Un usuario tiene un único token
user_Schema.hasOne(token_Schema, {
	foreignKey: 'id_user_fk',
	sourceKey: 'id_user',
})

/* ------------------------------- META DATA - LOGIN -----------------------------*/

export const meta_data_Schema = db_main.define(
	'meta_data',
	{
		id_meta_data: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		ip: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		userAgent: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		browser: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		os: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		device: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		tableName: 'meta_data',
	}
)

/* ------------------------------- LOGS -----------------------------*/

export const logs_Schema = db_main.define(
	'logs',
	{
		id_log: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		level: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		user_fk: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'users',
				key: 'id_user',
			},
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		action: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		httpMethod: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		meta: {
			type: DataTypes.JSON,
			allowNull: true,
		},
		ipAddress: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		endpoint: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		paranoid: true,
		timestamps: true,
		tableName: 'logs',
	}
)

logs_Schema.belongsTo(user_Schema, {
	foreignKey: 'user_fk',
	targetKey: 'id_user',
	onDelete: 'SET NULL',
})
