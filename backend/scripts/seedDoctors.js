#!/usr/bin/env node
import dotenv from 'dotenv'
dotenv.config()
import connectDB from '../config/mongodb.js'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import doctorModel from '../models/doctorModel.js'

const seed = async () => {
  try {
    await connectDB()

    const passwordHash = await bcrypt.hash('password123', 10)

    const doctors = [
      // General physician
      {
        name: 'Dr. Arjun Sharma',
        email: 'arjun.sharma@example.com',
        password: passwordHash,
        image: '/images/default-doctor.svg',
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '5 Year',
        about: 'Experienced general physician providing comprehensive primary care.',
        available: true,
        fees: 500,
        slots_booked: {},
        address: { line1: 'Sector 12', line2: 'New Delhi' },
        date: Date.now(),
      },
      {
        name: 'Dr. Meera Iyer',
        email: 'meera.iyer@example.com',
        password: passwordHash,
        image: '/images/default-doctor.svg',
        speciality: 'General physician',
        degree: 'MBBS, MD',
        experience: '8 Year',
        about: 'Primary care specialist with a focus on preventive medicine.',
        available: true,
        fees: 600,
        slots_booked: {},
        address: { line1: 'MG Road', line2: 'Bengaluru' },
        date: Date.now(),
      },

      // Gynecologist
      {
        name: 'Dr. Kavita Rao',
        email: 'kavita.rao@example.com',
        password: passwordHash,
        image: '/images/default-doctor.svg',
        speciality: 'Gynecologist',
        degree: 'MBBS, DGO',
        experience: '10 Year',
        about: 'Specialist in women’s health and prenatal care.',
        available: true,
        fees: 1000,
        slots_booked: {},
        address: { line1: 'Marine Drive', line2: 'Mumbai' },
        date: Date.now(),
      },
      {
        name: 'Dr. Nisha Patel',
        email: 'nisha.patel@example.com',
        password: passwordHash,
        image: '/images/default-doctor.svg',
        speciality: 'Gynecologist',
        degree: 'MBBS, MS',
        experience: '7 Year',
        about: 'Provides personalized gynaecological and reproductive health services.',
        available: true,
        fees: 900,
        slots_booked: {},
        address: { line1: 'Camp Area', line2: 'Pune' },
        date: Date.now(),
      },

      // Dermatologist
      {
        name: 'Dr. Rohit Gupta',
        email: 'rohit.gupta@example.com',
        password: passwordHash,
        image: '/images/default-doctor.svg',
        speciality: 'Dermatologist',
        degree: 'MBBS, DDV',
        experience: '6 Year',
        about: 'Skin specialist offering treatment for acne, eczema and more.',
        available: true,
        fees: 800,
        slots_booked: {},
        address: { line1: 'Salt Lake', line2: 'Kolkata' },
        date: Date.now(),
      },
      {
        name: 'Dr. Priya Menon',
        email: 'priya.menon@example.com',
        password: passwordHash,
        image: '/images/default-doctor.svg',
        speciality: 'Dermatologist',
        degree: 'MBBS, MD',
        experience: '9 Year',
        about: 'Expert in cosmetic and clinical dermatology.',
        available: true,
        fees: 950,
        slots_booked: {},
        address: { line1: 'Aluva', line2: 'Kerala' },
        date: Date.now(),
      },

      // Pediatricians
      {
        name: 'Dr. Suresh Kumar',
        email: 'suresh.kumar@example.com',
        password: passwordHash,
        image: '/images/default-doctor.svg',
        speciality: 'Pediatricians',
        degree: 'MBBS, DCH',
        experience: '12 Year',
        about: 'Child health specialist with extensive neonatal care experience.',
        available: true,
        fees: 700,
        slots_booked: {},
        address: { line1: 'Civil Lines', line2: 'Lucknow' },
        date: Date.now(),
      },
      {
        name: 'Dr. Anjali Desai',
        email: 'anjali.desai@example.com',
        password: passwordHash,
        image: '/images/default-doctor.svg',
        speciality: 'Pediatricians',
        degree: 'MBBS, MD',
        experience: '8 Year',
        about: 'Pediatrician focusing on growth and developmental care.',
        available: true,
        fees: 650,
        slots_booked: {},
        address: { line1: 'Bandra', line2: 'Mumbai' },
        date: Date.now(),
      },

      // Neurologist
      {
        name: 'Dr. Vikram Singh',
        email: 'vikram.singh@example.com',
        password: passwordHash,
        image: '/images/default-doctor.svg',
        speciality: 'Neurologist',
        degree: 'MBBS, DM',
        experience: '11 Year',
        about: 'Neurology expert handling epilepsy and stroke cases.',
        available: true,
        fees: 1200,
        slots_booked: {},
        address: { line1: 'Sector 17', line2: 'Chandigarh' },
        date: Date.now(),
      },
      {
        name: 'Dr. Neeraj Verma',
        email: 'neeraj.verma@example.com',
        password: passwordHash,
        image: '/images/default-doctor.svg',
        speciality: 'Neurologist',
        degree: 'MBBS, MD',
        experience: '7 Year',
        about: 'Focus on neurodegenerative disorders and clinical neurology.',
        available: true,
        fees: 1100,
        slots_booked: {},
        address: { line1: 'Rajendra Nagar', line2: 'Patna' },
        date: Date.now(),
      },

      // Gastroenterologist
      {
        name: 'Dr. Mohan Reddy',
        email: 'mohan.reddy@example.com',
        password: passwordHash,
        image: '/images/default-doctor.svg',
        speciality: 'Gastroenterologist',
        degree: 'MBBS, DM',
        experience: '10 Year',
        about: 'Specialist in liver and digestive disorders.',
        available: true,
        fees: 1100,
        slots_booked: {},
        address: { line1: 'Banjara Hills', line2: 'Hyderabad' },
        date: Date.now(),
      },
      {
        name: 'Dr. Richa Sharma',
        email: 'richa.sharma@example.com',
        password: passwordHash,
        image: '/images/default-doctor.svg',
        speciality: 'Gastroenterologist',
        degree: 'MBBS, MD',
        experience: '6 Year',
        about: 'Experienced in endoscopy and gastrointestinal treatments.',
        available: true,
        fees: 1000,
        slots_booked: {},
        address: { line1: 'Model Town', line2: 'Delhi' },
        date: Date.now(),
      },
    ]

    // Remove existing sample doctors with these emails (idempotent)
    const emails = doctors.map(d => d.email)
    await doctorModel.deleteMany({ email: { $in: emails } })

    const inserted = await doctorModel.insertMany(doctors)
    console.log(`Inserted ${inserted.length} doctors`)
    mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('Seeding error:', error)
    mongoose.connection.close()
    process.exit(1)
  }
}

seed()
