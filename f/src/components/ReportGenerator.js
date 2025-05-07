import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  TextField,
  Divider
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import axios from 'axios';
import { endpoints } from '../config';
import jsPDF from 'jspdf';

function ReportGenerator() {
  const [pets, setPets] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(endpoints.pets);
        setPets(response.data);
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };
    
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPetId) {
      const fetchTreatments = async () => {
        setLoading(true);
        try {
          const [petResponse, treatmentsResponse] = await Promise.all([
            axios.get(endpoints.pet(selectedPetId)),
            axios.get(endpoints.petTreatments(selectedPetId))
          ]);
          
          setCurrentPet(petResponse.data);
          
          // Filter treatments by date if needed
          let filteredTreatments = treatmentsResponse.data;
          
          if (startDate) {
            const startDateObj = new Date(startDate);
            filteredTreatments = filteredTreatments.filter(t => 
              new Date(t.date) >= startDateObj
            );
          }
          
          if (endDate) {
            const endDateObj = new Date(endDate);
            endDateObj.setHours(23, 59, 59, 999); // End of day
            filteredTreatments = filteredTreatments.filter(t => 
              new Date(t.date) <= endDateObj
            );
          }
          
          // Filter by type if needed
          if (reportType !== 'all') {
            filteredTreatments = filteredTreatments.filter(t => 
              t.type === reportType
            );
          }
          
          setTreatments(filteredTreatments);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchTreatments();
    } else {
      setTreatments([]);
      setCurrentPet(null);
    }
  }, [selectedPetId, startDate, endDate, reportType]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount).toFixed(2)}`;
  };

  const handlePetChange = (e) => {
    setSelectedPetId(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  const calculateTotalCost = () => {
    return treatments.reduce((sum, treatment) => sum + (treatment.cost || 0), 0);
  };

  const generatePDF = () => {
    if (!currentPet || !treatments.length) return;

    // Create a new jsPDF instance
    const doc = new jsPDF();
    const reportTitle = `Treatment Report - ${currentPet?.name} (${currentPet?.petId})`;
    const reportDate = new Date().toLocaleDateString();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add title
    doc.setFontSize(18);
    doc.text(reportTitle, pageWidth / 2, 15, { align: 'center' });
    
    // Add report date
    doc.setFontSize(10);
    doc.text(`Generated on: ${reportDate}`, pageWidth / 2, 22, { align: 'center' });
    
    // Add pet information
    doc.setFontSize(12);
    doc.text('Pet Information', 14, 35);
    doc.setFontSize(10);
    doc.text(`Name: ${currentPet.name}`, 14, 42);
    doc.text(`Pet ID: ${currentPet.petId}`, 14, 48);
    doc.text(`Species: ${currentPet.species}`, 14, 54);
    doc.text(`Breed: ${currentPet.breed || 'Not specified'}`, 14, 60);
    doc.text(`Age: ${currentPet.age}`, 14, 66);
    doc.text(`Owner: ${currentPet.ownerName}`, 14, 72);
    
    // Add treatment summary
    doc.setFontSize(12);
    doc.text('Treatment Summary', 14, 85);
    doc.setFontSize(10);
    doc.text(`Total Treatments: ${treatments.length}`, 14, 92);
    doc.text(`Total Cost: ${formatCurrency(calculateTotalCost())}`, 14, 98);
    
    let currentY = 104;
    
    if (startDate) {
      doc.text(`From: ${new Date(startDate).toLocaleDateString()}`, 14, currentY);
      currentY += 6;
    }
    
    if (endDate) {
      doc.text(`To: ${new Date(endDate).toLocaleDateString()}`, 14, currentY);
      currentY += 6;
    }
    
    if (reportType !== 'all') {
      doc.text(`Type: ${reportType}`, 14, currentY);
      currentY += 6;
    }
    
    // Draw table header
    currentY += 10;
    const tableTop = currentY;
    const colWidths = [30, 35, 45, 30, 30];
    const headers = ['Date', 'Type', 'Performed By', 'Status', 'Cost'];
    
    doc.setFillColor(220, 220, 220);
    doc.rect(14, currentY - 6, pageWidth - 28, 10, 'F');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    
    let xPos = 14;
    for (let i = 0; i < headers.length; i++) {
      if (i === headers.length - 1) {
        // Align the cost column to the right
        doc.text(headers[i], xPos + colWidths[i] - 2, currentY, { align: 'right' });
      } else {
        doc.text(headers[i], xPos, currentY);
      }
      xPos += colWidths[i];
    }
    
    // Draw table body
    doc.setFont('helvetica', 'normal');
    currentY += 10;
    
    let rowCount = 0;
    for (const treatment of treatments) {
      if (currentY > 270) { // Check if we need a new page
        doc.addPage();
        currentY = 20;
      }
      
      // Add alternating row backgrounds
      if (rowCount % 2 === 1) {
        doc.setFillColor(245, 245, 245);
        doc.rect(14, currentY - 6, pageWidth - 28, 10, 'F');
      }
      
      // Add row data
      xPos = 14;
      
      // Date
      doc.text(formatDate(treatment.date), xPos, currentY);
      xPos += colWidths[0];
      
      // Type (capitalized)
      doc.text(treatment.type.charAt(0).toUpperCase() + treatment.type.slice(1), xPos, currentY);
      xPos += colWidths[1];
      
      // Performed By
      doc.text(treatment.performedBy || 'Not specified', xPos, currentY);
      xPos += colWidths[2];
      
      // Status (capitalized)
      doc.text(treatment.status.charAt(0).toUpperCase() + treatment.status.slice(1), xPos, currentY);
      xPos += colWidths[3];
      
      // Cost (right aligned)
      doc.text(treatment.cost ? formatCurrency(treatment.cost) : '-', xPos + colWidths[4] - 2, currentY, { align: 'right' });
      
      currentY += 10;
      rowCount++;
    }
    
    // Add total row
    doc.setFillColor(220, 220, 220);
    doc.rect(14, currentY - 6, pageWidth - 28, 10, 'F');
    doc.setFont('helvetica', 'bold');
    
    // Total label (right aligned before the cost column)
    const totalLabelPos = 14 + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] - 2;
    doc.text('Total', totalLabelPos, currentY, { align: 'right' });
    
    // Total cost (right aligned)
    const totalValuePos = totalLabelPos + colWidths[3] - 2;
    doc.text(formatCurrency(calculateTotalCost()), totalValuePos + 32, currentY, { align: 'right' });
    
    // Add notes
    currentY += 20;
    doc.setFontSize(12);
    doc.text('Notes', 14, currentY);
    currentY += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('This report was automatically generated by the Pet Care Management System.', 14, currentY);
    
    // Save the PDF
    const fileName = `${currentPet.name}_treatment_report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const handlePrint = () => {
    const reportTitle = `Treatment Report - ${currentPet?.name} (${currentPet?.petId})`;
    const reportDate = new Date().toLocaleDateString();
    
    // Create a printable div with the report content
    const printContent = document.createElement('div');
    printContent.style.display = 'none';
    printContent.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2>${reportTitle}</h2>
          <p>Generated on: ${reportDate}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3>Pet Information</h3>
          <p>Name: ${currentPet?.name}</p>
          <p>Pet ID: ${currentPet?.petId}</p>
          <p>Species: ${currentPet?.species}</p>
          <p>Breed: ${currentPet?.breed || 'Not specified'}</p>
          <p>Age: ${currentPet?.age}</p>
          <p>Owner: ${currentPet?.ownerName}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3>Treatment Summary</h3>
          <p>Total Treatments: ${treatments.length}</p>
          <p>Total Cost: ${formatCurrency(calculateTotalCost())}</p>
          ${startDate ? `<p>From: ${new Date(startDate).toLocaleDateString()}</p>` : ''}
          ${endDate ? `<p>To: ${new Date(endDate).toLocaleDateString()}</p>` : ''}
          ${reportType !== 'all' ? `<p>Type: ${reportType}</p>` : ''}
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Type</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Performed By</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Status</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Cost</th>
            </tr>
          </thead>
          <tbody>
            ${treatments.map(treatment => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${formatDate(treatment.date)}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-transform: capitalize;">${treatment.type}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${treatment.performedBy || 'Not specified'}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-transform: capitalize;">${treatment.status}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${treatment.cost ? formatCurrency(treatment.cost) : '-'}</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">Total</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">${formatCurrency(calculateTotalCost())}</td>
            </tr>
          </tbody>
        </table>
        
        <div style="margin-top: 30px;">
          <h3>Notes</h3>
          <p>This report was automatically generated by the Pet Care Management System.</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(printContent);
    
    const oldTitle = document.title;
    document.title = reportTitle;
    
    window.print();
    
    document.title = oldTitle;
    document.body.removeChild(printContent);
  };

  const downloadCSV = () => {
    if (!treatments.length || !currentPet) return;
    
    const headers = ['Date', 'Type', 'Performed By', 'Cost', 'Status', 'Notes'];
    
    const csvContent = [
      headers.join(','),
      ...treatments.map(treatment => [
        formatDate(treatment.date),
        treatment.type,
        treatment.performedBy || 'Not specified',
        treatment.cost || '0',
        treatment.status,
        treatment.notes ? `"${treatment.notes.replace(/"/g, '""')}"` : ''
      ].join(','))
    ].join('\n');
    
    const fileName = `${currentPet.name}_treatments_${new Date().toISOString().split('T')[0]}.csv`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, mb: 6 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Treatment Report Generator
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="pet-select-label">Select Pet</InputLabel>
              <Select
                labelId="pet-select-label"
                value={selectedPetId}
                onChange={handlePetChange}
                label="Select Pet"
              >
                <MenuItem value="">
                  <em>-- Select a pet --</em>
                </MenuItem>
                {pets.map((pet) => (
                  <MenuItem key={pet._id} value={pet._id}>
                    {pet.name} ({pet.petId})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="report-type-label">Treatment Type</InputLabel>
              <Select
                labelId="report-type-label"
                value={reportType}
                onChange={handleReportTypeChange}
                label="Treatment Type"
              >
                <MenuItem value="all">All Treatments</MenuItem>
                <MenuItem value="vaccination">Vaccination</MenuItem>
                <MenuItem value="deworming">Deworming</MenuItem>
                <MenuItem value="checkup">Checkup</MenuItem>
                <MenuItem value="surgery">Surgery</MenuItem>
                <MenuItem value="grooming">Grooming</MenuItem>
                <MenuItem value="medication">Medication</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {currentPet ? (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Report Preview
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                      <strong>Pet:</strong> {currentPet.name} ({currentPet.petId})
                    </Typography>
                    <Typography variant="subtitle1">
                      <strong>Owner:</strong> {currentPet.ownerName}
                    </Typography>
                    <Typography variant="subtitle1">
                      <strong>Total Treatments:</strong> {treatments.length}
                    </Typography>
                    <Typography variant="subtitle1">
                      <strong>Total Cost:</strong> {formatCurrency(calculateTotalCost())}
                    </Typography>
                  </Box>
                </Box>
                
                {treatments.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={downloadCSV}
                        color="primary"
                      >
                        Download CSV
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={generatePDF}
                        color="secondary"
                      >
                        Generate PDF
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<LocalPrintshopIcon />}
                        onClick={handlePrint}
                      >
                        Print
                      </Button>
                    </Box>
                    
                    <Paper variant="outlined" sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Date</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Type</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Performed By</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Status</th>
                            <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          {treatments.map((treatment) => (
                            <tr key={treatment._id}>
                              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{formatDate(treatment.date)}</td>
                              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textTransform: 'capitalize' }}>{treatment.type}</td>
                              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{treatment.performedBy || '-'}</td>
                              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textTransform: 'capitalize' }}>{treatment.status}</td>
                              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>{treatment.cost ? formatCurrency(treatment.cost) : '-'}</td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={4} style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>Total</td>
                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(calculateTotalCost())}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Paper>
                  </Box>
                ) : (
                  <Typography variant="subtitle1" sx={{ mt: 2, textAlign: 'center' }}>
                    No treatments found for the selected criteria.
                  </Typography>
                )}
              </>
            ) : (
              <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                Please select a pet to generate a report.
              </Typography>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}

export default ReportGenerator;