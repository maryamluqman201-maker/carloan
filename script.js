// Car Loan Calculator Script

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loan-form');
    const results = document.getElementById('results');
    const diagrams = document.getElementById('diagrams');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateLoan();
    });

    function calculateLoan() {
        const carPrice = parseFloat(document.getElementById('car-price').value);
        const downPayment = parseFloat(document.getElementById('down-payment').value);
        const loanTerm = parseInt(document.getElementById('loan-term').value);
        const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100 / 12;

        const loanAmount = carPrice - downPayment;
        const monthlyPayment = (loanAmount * interestRate * Math.pow(1 + interestRate, loanTerm)) / (Math.pow(1 + interestRate, loanTerm) - 1);
        const totalPayment = monthlyPayment * loanTerm;
        const totalInterest = totalPayment - loanAmount;

        document.getElementById('monthly-payment').textContent = `$${monthlyPayment.toFixed(2)}`;
        document.getElementById('total-interest').textContent = `$${totalInterest.toFixed(2)}`;
        document.getElementById('total-payment').textContent = `$${totalPayment.toFixed(2)}`;

        results.style.display = 'block';
        diagrams.style.display = 'block';

        // Scroll to results
        results.scrollIntoView({ behavior: 'smooth' });

        // Generate charts
        generatePaymentChart(carPrice, downPayment, loanAmount, totalInterest);
        generateAmortizationChart(loanTerm, monthlyPayment, interestRate, loanAmount);
    }

    function generatePaymentChart(carPrice, downPayment, loanAmount, totalInterest) {
        const ctx = document.getElementById('payment-chart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (window.paymentChart) {
            window.paymentChart.destroy();
        }

        window.paymentChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Down Payment', 'Loan Amount', 'Total Interest'],
                datasets: [{
                    data: [downPayment, loanAmount, totalInterest],
                    backgroundColor: [
                        '#d4af37',
                        '#f4c430',
                        '#b8860b'
                    ],
                    borderColor: '#1a1a1a',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#e0e0e0',
                            font: {
                                size: 14
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Loan Breakdown',
                        color: '#d4af37',
                        font: {
                            size: 18,
                            family: 'Playfair Display'
                        }
                    }
                }
            }
        });
    }

    function generateAmortizationChart(loanTerm, monthlyPayment, interestRate, loanAmount) {
        const ctx = document.getElementById('amortization-chart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (window.amortizationChart) {
            window.amortizationChart.destroy();
        }

        const labels = [];
        const principalData = [];
        const interestData = [];
        const balanceData = [];

        let balance = loanAmount;
        for (let month = 1; month <= loanTerm; month++) {
            const interestPayment = balance * interestRate;
            const principalPayment = monthlyPayment - interestPayment;
            balance -= principalPayment;

            if (month % 12 === 0 || month === loanTerm) {
                labels.push(`Year ${Math.ceil(month / 12)}`);
                principalData.push(principalPayment * 12);
                interestData.push(interestPayment * 12);
                balanceData.push(balance);
            }
        }

        window.amortizationChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Principal Payment',
                    data: principalData,
                    borderColor: '#d4af37',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Interest Payment',
                    data: interestData,
                    borderColor: '#f4c430',
                    backgroundColor: 'rgba(244, 196, 48, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Remaining Balance',
                    data: balanceData,
                    borderColor: '#b8860b',
                    backgroundColor: 'rgba(184, 134, 11, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#e0e0e0',
                            font: {
                                size: 14
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Amortization Schedule',
                        color: '#d4af37',
                        font: {
                            size: 18,
                            family: 'Playfair Display'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#e0e0e0'
                        },
                        grid: {
                            color: 'rgba(224, 224, 224, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#e0e0e0',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(224, 224, 224, 0.1)'
                        }
                    }
                }
            }
        });
    }
});